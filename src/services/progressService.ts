import { HISTORY_LIMIT, WEAK_CLEAR_STREAK } from '../config/game'
import { rankScore, type BattleResult } from '../game/result'
import type { MissionDefinition } from '../types/mission'
import type { DailyRecord, PlayerProgress } from '../types/progress'
import { daysBetween, toDateKey } from '../utils/date'
import { getLevelInfo } from '../utils/level'
import { getMissionStatuses } from './missionService'
import { storage } from './storage'

export function createDailyRecord(date: string): DailyRecord {
  return {
    date,
    battles: 0,
    clearedBattles: 0,
    answered: 0,
    correct: 0,
    maxCombo: 0,
    perfectBattles: 0,
    bestRankScore: 0,
    categoryCorrect: { vocabulary: 0, grammar: 0, phrases: 0 },
    claimedMissionIds: [],
  }
}

export function createInitialProgress(today: string = toDateKey()): PlayerProgress {
  return {
    schemaVersion: 1,
    totalXp: 0,
    streak: { current: 0, best: 0, lastStudyDate: null },
    stats: {
      battles: 0,
      answered: 0,
      correct: 0,
      studyTimeMs: 0,
      bestScore: 0,
      bestCombo: 0,
      byCategory: {
        vocabulary: { answered: 0, correct: 0 },
        grammar: { answered: 0, correct: 0 },
        phrases: { answered: 0, correct: 0 },
      },
    },
    weak: {},
    daily: createDailyRecord(today),
    history: [],
    settings: { sound: true, vibration: true },
  }
}

/** 日付が変わっていれば今日の記録をリセットする。 */
export function withFreshDaily(progress: PlayerProgress, today: string = toDateKey()): PlayerProgress {
  if (progress.daily.date === today) return progress
  return { ...progress, daily: createDailyRecord(today) }
}

/**
 * 表示用の連続学習日数。最後に学習したのが今日か昨日なら継続中、
 * それより前なら途切れているので 0 を返す。
 */
export function getActiveStreak(progress: PlayerProgress, today: string = toDateKey()): number {
  const last = progress.streak.lastStudyDate
  if (!last) return 0
  return daysBetween(last, today) <= 1 ? progress.streak.current : 0
}

/** 全体の正答率（%）。未回答なら null。 */
export function getAccuracy(answered: number, correct: number): number | null {
  return answered > 0 ? Math.round((correct / answered) * 100) : null
}

/** 連続学習日数を更新する（今日はじめての学習なら +1、1 日以上空いたら 1 から）。 */
export function updateStreak(streak: PlayerProgress['streak'], today: string): PlayerProgress['streak'] {
  if (streak.lastStudyDate === today) return streak
  const continued = streak.lastStudyDate !== null && daysBetween(streak.lastStudyDate, today) === 1
  const current = continued ? streak.current + 1 : 1
  return { current, best: Math.max(streak.best, current), lastStudyDate: today }
}

/** 苦手問題を更新する。間違えたら登録、登録済みの問題に続けて正解したら外す。 */
export function updateWeak(
  weak: PlayerProgress['weak'],
  answers: BattleResult['answers'],
  nowIso: string,
): PlayerProgress['weak'] {
  const next = { ...weak }
  for (const { question, correct } of answers) {
    const id = question.source.id
    const entry = next[id]
    if (!correct) {
      next[id] = { id, wrongCount: (entry?.wrongCount ?? 0) + 1, correctStreak: 0, lastWrongAt: nowIso }
    } else if (entry) {
      const correctStreak = entry.correctStreak + 1
      if (correctStreak >= WEAK_CLEAR_STREAK) delete next[id]
      else next[id] = { ...entry, correctStreak }
    }
  }
  return next
}

export interface BattleOutcome {
  progress: PlayerProgress
  /** このバトルで達成したミッション */
  completedMissions: MissionDefinition[]
  levelBefore: number
  levelAfter: number
  /** 獲得 XP 合計（バトル + ミッション報酬） */
  xpGained: number
}

/**
 * バトル結果を学習データに反映する（純粋関数）。
 * XP・レベル・連続学習日数・統計・苦手問題・今日のミッション・履歴をまとめて更新する。
 */
export function applyBattleResult(prev: PlayerProgress, result: BattleResult, now: Date = new Date()): BattleOutcome {
  const today = toDateKey(now)
  const base = withFreshDaily(prev, today)
  const answered = result.answers.length

  const byCategory = structuredClone(base.stats.byCategory)
  const categoryCorrect = { ...base.daily.categoryCorrect }
  for (const a of result.answers) {
    const cat = a.question.source.category
    byCategory[cat].answered++
    if (a.correct) {
      byCategory[cat].correct++
      categoryCorrect[cat]++
    }
  }

  const daily: DailyRecord = {
    ...base.daily,
    battles: base.daily.battles + 1,
    clearedBattles: base.daily.clearedBattles + (result.cleared ? 1 : 0),
    answered: base.daily.answered + answered,
    correct: base.daily.correct + result.correctCount,
    maxCombo: Math.max(base.daily.maxCombo, result.maxCombo),
    perfectBattles: base.daily.perfectBattles + (result.perfect ? 1 : 0),
    bestRankScore: Math.max(base.daily.bestRankScore, rankScore(result.rank)),
    categoryCorrect,
  }

  // 今日のミッション：新たに達成したものの報酬を受け取る
  const completed = getMissionStatuses(daily)
    .filter((m) => m.done && !m.claimed)
    .map((m) => m.mission)
  daily.claimedMissionIds = [...daily.claimedMissionIds, ...completed.map((m) => m.id)]
  const missionXp = completed.reduce((sum, m) => sum + m.rewardXp, 0)
  const xpGained = result.xp.total + missionXp

  const progress: PlayerProgress = {
    ...base,
    totalXp: base.totalXp + xpGained,
    streak: updateStreak(base.streak, today),
    stats: {
      battles: base.stats.battles + 1,
      answered: base.stats.answered + answered,
      correct: base.stats.correct + result.correctCount,
      studyTimeMs: base.stats.studyTimeMs + Math.max(0, Math.round(result.durationMs)),
      bestScore: Math.max(base.stats.bestScore, result.score),
      bestCombo: Math.max(base.stats.bestCombo, result.maxCombo),
      byCategory,
    },
    weak: updateWeak(base.weak, result.answers, now.toISOString()),
    daily,
    history: [
      {
        at: now.toISOString(),
        mode: result.config.mode,
        score: result.score,
        correct: result.correctCount,
        total: result.totalQuestions,
        maxCombo: result.maxCombo,
        rank: result.rank,
        xpGained,
        durationMs: Math.round(result.durationMs),
      },
      ...base.history,
    ].slice(0, HISTORY_LIMIT),
  }

  return {
    progress,
    completedMissions: completed,
    levelBefore: getLevelInfo(base.totalXp).level,
    levelAfter: getLevelInfo(progress.totalXp).level,
    xpGained,
  }
}

// ---------- 保存・読み込み ----------

const STORAGE_KEY = 'progress'

/**
 * 保存データを現在の形に合わせる。
 * 古いバージョンのデータや項目の欠けたデータでも、初期値で補って読み込めるようにする。
 */
export function migrate(raw: unknown): PlayerProgress {
  const init = createInitialProgress()
  if (!raw || typeof raw !== 'object') return init
  const data = raw as Partial<PlayerProgress>
  // schemaVersion が上がったら、ここで旧バージョンからの変換処理を追加する
  return {
    ...init,
    ...data,
    schemaVersion: 1,
    streak: { ...init.streak, ...data.streak },
    stats: {
      ...init.stats,
      ...data.stats,
      byCategory: { ...init.stats.byCategory, ...data.stats?.byCategory },
    },
    daily: {
      ...init.daily,
      ...data.daily,
      categoryCorrect: { ...init.daily.categoryCorrect, ...data.daily?.categoryCorrect },
    },
    settings: { ...init.settings, ...data.settings },
    weak: data.weak ?? {},
    history: Array.isArray(data.history) ? data.history : [],
  }
}

export async function loadProgress(): Promise<PlayerProgress> {
  try {
    return withFreshDaily(migrate(await storage.get<PlayerProgress>(STORAGE_KEY)))
  } catch (e) {
    console.error('学習データの読み込みに失敗しました', e)
    return createInitialProgress()
  }
}

export async function saveProgress(progress: PlayerProgress): Promise<void> {
  try {
    await storage.set(STORAGE_KEY, progress)
  } catch (e) {
    console.error('学習データの保存に失敗しました', e)
  }
}

export async function clearProgress(): Promise<void> {
  await storage.remove(STORAGE_KEY)
}
