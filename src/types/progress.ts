import type { BattleMode, Rank } from './battle'
import type { QuestionCategory } from './question'

export interface CategoryStats {
  answered: number
  correct: number
}

/** 苦手問題の記録。間違えると登録され、続けて正解すると外れる。 */
export interface WeakQuestion {
  id: string
  wrongCount: number
  /** 登録後に連続で正解した回数 */
  correctStreak: number
  lastWrongAt: string
}

/** 1 日分の学習記録（今日のミッションの判定に使う）。日付が変わるとリセット。 */
export interface DailyRecord {
  /** YYYY-MM-DD（端末のローカル日付） */
  date: string
  battles: number
  clearedBattles: number
  answered: number
  correct: number
  maxCombo: number
  perfectBattles: number
  bestRankScore: number
  categoryCorrect: Record<QuestionCategory, number>
  /** 報酬を受け取り済みのミッション ID */
  claimedMissionIds: string[]
}

export interface BattleHistoryEntry {
  at: string
  mode: BattleMode
  score: number
  correct: number
  total: number
  maxCombo: number
  rank: Rank
  xpGained: number
  durationMs: number
}

export interface PlayerSettings {
  sound: boolean
  vibration: boolean
}

/**
 * プレイヤーの学習データ全体。保存・読み込みはこの単位で行う。
 * 形を変えるときは schemaVersion を上げ、progressService の migrate で変換する。
 */
export interface PlayerProgress {
  schemaVersion: 1
  totalXp: number
  streak: {
    current: number
    best: number
    lastStudyDate: string | null
  }
  stats: {
    battles: number
    answered: number
    correct: number
    studyTimeMs: number
    bestScore: number
    bestCombo: number
    byCategory: Record<QuestionCategory, CategoryStats>
  }
  weak: Record<string, WeakQuestion>
  daily: DailyRecord
  /** 新しい順。最大 HISTORY_LIMIT 件 */
  history: BattleHistoryEntry[]
  settings: PlayerSettings
}
