import type { DailyRecord, PlayerProgress } from '../types/progress'
import { daysBetween, toDateKey } from '../utils/date'

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
