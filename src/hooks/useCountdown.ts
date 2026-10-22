import { useEffect, useRef, useState } from 'react'

/**
 * 制限時間のカウントダウン。
 * - running が false の間は止まる（回答後のフィードバック表示中など）
 * - resetKey が変わると最初からやり直す（次の問題へ進んだとき）
 * - アプリがバックグラウンドに回った間（電話・通知など）は時間を進めない
 */
export function useCountdown(totalMs: number, running: boolean, resetKey: unknown, onExpire: () => void) {
  // 表示用の残り時間。resetKey が変わった直後は満タンとして扱う
  const [tick, setTick] = useState({ key: resetKey, remainingMs: totalMs })
  const remainingMs = tick.key === resetKey ? tick.remainingMs : totalMs
  const elapsed = useRef(0)
  const elapsedKey = useRef(resetKey)
  const onExpireRef = useRef(onExpire)

  useEffect(() => {
    onExpireRef.current = onExpire
  }, [onExpire])

  useEffect(() => {
    if (elapsedKey.current !== resetKey) {
      elapsedKey.current = resetKey
      elapsed.current = 0
    }
    if (!running) return
    let last = performance.now()
    let expired = false
    const id = window.setInterval(() => {
      const now = performance.now()
      if (document.visibilityState === 'visible') elapsed.current += now - last
      last = now
      const rest = Math.max(0, totalMs - elapsed.current)
      setTick({ key: resetKey, remainingMs: rest })
      if (rest === 0 && !expired) {
        expired = true
        onExpireRef.current()
      }
    }, 100)
    return () => window.clearInterval(id)
  }, [running, resetKey, totalMs])

  /** 問題が表示されてからの経過時間（ミリ秒） */
  const getElapsedMs = () => elapsed.current
  return { remainingMs, getElapsedMs }
}
