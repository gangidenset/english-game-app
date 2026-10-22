interface Props {
  value: number
  max: number
  color?: string
  height?: number
  label?: string
}

/** 横型ゲージ（XP・タイマー・正答率などに使う）。 */
export function ProgressBar({ value, max, color = 'var(--color-xp)', height = 10, label }: Props) {
  const ratio = max > 0 ? Math.min(1, Math.max(0, value / max)) : 0
  return (
    <div
      className="progress"
      style={{ height }}
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={Math.round(value)}
    >
      <div className="progress__fill" style={{ width: `${ratio * 100}%`, background: color }} />
    </div>
  )
}
