import { createContext, useContext } from 'react'
import type { BattleResult } from '../game/result'
import type { BattleOutcome } from '../services/progressService'
import type { PlayerProgress, PlayerSettings } from '../types/progress'

export interface ProgressContextValue {
  progress: PlayerProgress
  /** バトル結果を学習データに反映して保存し、反映結果（レベルアップ等）を返す */
  commitBattle: (result: BattleResult) => BattleOutcome
  updateSettings: (patch: Partial<PlayerSettings>) => void
  /** 学習データをすべて消去する */
  resetProgress: () => Promise<void>
}

export const ProgressContext = createContext<ProgressContextValue | null>(null)

export function useProgress(): ProgressContextValue {
  const ctx = useContext(ProgressContext)
  if (!ctx) throw new Error('useProgress は ProgressProvider の中で使ってください')
  return ctx
}
