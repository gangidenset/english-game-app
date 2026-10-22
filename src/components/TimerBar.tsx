import { ProgressBar } from './ProgressBar'

interface Props {
  /** 残り時間（ミリ秒） */
  remainingMs: number
  totalMs: number
}

/** 制限時間ゲージ。残り 30% 以下で赤く点滅する。 */
export function TimerBar({ remainingMs, totalMs }: Props) {
  const ratio = totalMs > 0 ? remainingMs / totalMs : 0
  const danger = ratio <= 0.3
  const color = danger ? 'var(--color-wrong)' : ratio <= 0.6 ? 'var(--color-combo)' : 'var(--color-correct)'
  return (
    <div className={danger ? 'timer timer--danger' : 'timer'}>
      <span aria-hidden>⏱</span>
      <ProgressBar value={remainingMs} max={totalMs} color={color} height={12} label="残り時間" />
      <span className="timer__num">{Math.ceil(remainingMs / 1000)}</span>
    </div>
  )
}
