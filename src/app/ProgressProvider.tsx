import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { BattleResult } from '../game/result'
import {
  applyBattleResult,
  clearProgress,
  createInitialProgress,
  loadProgress,
  saveProgress,
  withFreshDaily,
} from '../services/progressService'
import type { PlayerProgress, PlayerSettings } from '../types/progress'
import { ProgressContext, type ProgressContextValue } from './ProgressContext'

/** 学習データを読み込み、全画面に配り、変更があれば保存する Provider。 */
export function ProgressProvider({ children }: { children: ReactNode }) {
  const [progress, setProgress] = useState<PlayerProgress | null>(null)

  useEffect(() => {
    let active = true
    loadProgress().then((loaded) => {
      if (active) setProgress(loaded)
    })
    return () => {
      active = false
    }
  }, [])

  // 変更があるたびに保存する
  useEffect(() => {
    if (progress) void saveProgress(progress)
  }, [progress])

  const commitBattle = useCallback(
    (result: BattleResult) => {
      const outcome = applyBattleResult(progress ?? createInitialProgress(), result)
      setProgress(outcome.progress)
      return outcome
    },
    [progress],
  )

  const updateSettings = useCallback((patch: Partial<PlayerSettings>) => {
    setProgress((cur) => cur && { ...cur, settings: { ...cur.settings, ...patch } })
  }, [])

  const resetProgress = useCallback(async () => {
    await clearProgress()
    setProgress(createInitialProgress())
  }, [])

  const value = useMemo<ProgressContextValue | null>(
    () => progress && { progress: withFreshDaily(progress), commitBattle, updateSettings, resetProgress },
    [progress, commitBattle, updateSettings, resetProgress],
  )

  if (!value) {
    return (
      <div className="app-shell">
        <main className="page page--center">
          <p className="muted">読み込み中…</p>
        </main>
      </div>
    )
  }
  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>
}
