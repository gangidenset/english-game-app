import type { BattleConfig } from './battle'

/**
 * 画面遷移の状態。
 * HOME → BATTLE → RESULT → REVIEW の流れ（＋学習記録画面）。
 * 結果データを持つ画面は、Phase 8 以降で項目を追加する。
 */
export type Screen =
  | { name: 'home' }
  | { name: 'battle'; config: BattleConfig }
  | { name: 'stats' }
