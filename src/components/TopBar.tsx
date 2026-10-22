import type { ReactNode } from 'react'

interface Props {
  title?: ReactNode
  onBack?: () => void
  right?: ReactNode
}

export function TopBar({ title, onBack, right }: Props) {
  return (
    <header className="topbar">
      {onBack && (
        <button type="button" className="topbar__back" onClick={onBack} aria-label="戻る">
          ←
        </button>
      )}
      <div className="topbar__title">{title}</div>
      {right}
    </header>
  )
}
