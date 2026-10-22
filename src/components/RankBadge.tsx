import type { Rank } from '../types/battle'

export function RankBadge({ rank }: { rank: Rank }) {
  return (
    <div className={`rank rank--${rank}`} aria-label={`ランク ${rank}`}>
      {rank}
    </div>
  )
}
