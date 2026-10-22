import type { ReactNode } from 'react'
import { Card } from './Card'

interface Props {
  icon?: ReactNode
  label: string
  value: ReactNode
  color?: string
}

export function StatTile({ icon, label, value, color }: Props) {
  return (
    <Card className="stat">
      {icon && <span className="stat__icon" aria-hidden>{icon}</span>}
      <span className="stat__value" style={{ color }}>
        {value}
      </span>
      <span className="stat__label">{label}</span>
    </Card>
  )
}
