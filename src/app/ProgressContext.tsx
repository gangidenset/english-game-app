import { createContext, useContext } from 'react'
import type { PlayerProgress } from '../types/progress'

export interface ProgressContextValue {
  progress: PlayerProgress
  /** 学習データを更新する（保存は Provider 側で行う） */
  updateProgress: (updater: (prev: PlayerProgress) => PlayerProgress) => void
}

export const ProgressContext = createContext<ProgressContextValue | null>(null)

export function useProgress(): ProgressContextValue {
  const ctx = useContext(ProgressContext)
  if (!ctx) throw new Error('useProgress は ProgressProvider の中で使ってください')
  return ctx
}
