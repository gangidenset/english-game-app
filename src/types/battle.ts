import type { QuestionCategory } from './question'

/** ランク（S が最高）。 */
export type Rank = 'S' | 'A' | 'B' | 'C' | 'D'

/**
 * バトルの種類。
 * - mixed: 全カテゴリから出題
 * - vocabulary / grammar / phrases: カテゴリ別
 * - weak: 苦手問題（過去に間違えた問題）から出題
 * - retry: 復習画面からの再挑戦（直前に間違えた問題のみ）
 */
export type BattleMode = 'mixed' | QuestionCategory | 'weak' | 'retry'

export interface BattleConfig {
  mode: BattleMode
  /** retry モードで出題する問題 ID */
  questionIds?: string[]
}
