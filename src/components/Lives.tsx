interface Props {
  lives: number
  max: number
}

/** ライフ（ハート）表示。 */
export function Lives({ lives, max }: Props) {
  return (
    <div className="lives" aria-label={`ライフ ${lives} / ${max}`}>
      {Array.from({ length: max }, (_, i) => (
        <span
          key={i}
          aria-hidden
          className={i < lives ? 'lives__heart' : 'lives__heart lives__heart--lost lives__heart--pop'}
        >
          ❤️
        </span>
      ))}
    </div>
  )
}
