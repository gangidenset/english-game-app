import type { BattleResult } from '../game/result'
import type { BattleConfig } from './battle'

/**
 * 画面遷移の状態。
 * HOME → BATTLE → RESULT → REVIEW の流れ（＋学習記録画面）。
 */
export type Screen =
  | { name: 'home' }
  | { name: 'battle'; config: BattleConfig; key: number }
  | { name: 'result'; result: BattleResult }
  | { name: 'stats' }
