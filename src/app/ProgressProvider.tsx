import { useCallback, useMemo, useState, type ReactNode } from 'react'
import { createInitialProgress, withFreshDaily } from '../services/progressService'
import type { PlayerProgress } from '../types/progress'
import { ProgressContext } from './ProgressContext'

/** 学習データを全画面に配る Provider（保存処理は Phase 10 で追加）。 */
export function ProgressProvider({ children }: { children: ReactNode }) {
  const [progress, setProgress] = useState<PlayerProgress>(() => createInitialProgress())

  const updateProgress = useCallback((updater: (prev: PlayerProgress) => PlayerProgress) => {
    setProgress((prev) => updater(withFreshDaily(prev)))
  }, [])

  const value = useMemo(
    () => ({ progress: withFreshDaily(progress), updateProgress }),
    [progress, updateProgress],
  )
  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>
}
