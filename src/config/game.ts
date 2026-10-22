import type { Rank } from '../types/battle'

/**
 * ゲームバランスの設定値。調整はこのファイルだけで行えるようにしている。
 */
export const BATTLE = {
  questionsPerBattle: 10,
  timePerQuestionMs: 15_000,
  maxLives: 3,
  /** 回答後に正解・解説を見せる時間 */
  feedbackMs: 1_100,
} as const

export const SCORE = {
  base: 100,
  /** 残り 1 秒あたりのボーナス */
  timeBonusPerSecond: 10,
  /** コンボ 1 つにつき +10% （最大 +100%） */
  comboStep: 0.1,
  comboMaxBonus: 1.0,
} as const

export const XP = {
  perCorrect: 10,
  /** スコア 100 点ごとに 1 XP */
  scoreDivisor: 100,
  clearBonus: 20,
  perfectBonus: 30,
} as const

/** ランク判定（正答率 %）。ゲームオーバー時は最高でも C。 */
export const RANK_THRESHOLDS: { rank: Rank; minAccuracy: number }[] = [
  { rank: 'S', minAccuracy: 90 },
  { rank: 'A', minAccuracy: 80 },
  { rank: 'B', minAccuracy: 60 },
  { rank: 'C', minAccuracy: 40 },
  { rank: 'D', minAccuracy: 0 },
]

/** レベル n → n+1 に必要な XP = base + (n - 1) * step */
export const LEVEL_CURVE = { base: 100, step: 50 } as const

/** レベルに応じた称号（minLevel の昇順） */
export const LEVEL_TITLES: { minLevel: number; title: string }[] = [
  { minLevel: 1, title: '英語ルーキー' },
  { minLevel: 5, title: 'ワードハンター' },
  { minLevel: 10, title: 'グラマーナイト' },
  { minLevel: 20, title: 'イングリッシュマスター' },
  { minLevel: 30, title: '入試の覇者' },
]

/** 苦手問題から外れるまでに必要な連続正解数 */
export const WEAK_CLEAR_STREAK = 2

/** 保存するバトル履歴の件数 */
export const HISTORY_LIMIT = 50

/** 1 日に出す「今日のミッション」の数 */
export const DAILY_MISSION_COUNT = 3
