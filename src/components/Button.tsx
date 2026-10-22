import type { ButtonHTMLAttributes } from 'react'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger'
type Size = 'sm' | 'md' | 'lg'

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  block?: boolean
}

/** 共通ボタン。タップしやすいよう最小高さ 52px を確保している。 */
export function Button({
  variant = 'primary',
  size = 'md',
  block = false,
  className = '',
  type = 'button',
  ...rest
}: Props) {
  const classes = ['btn', `btn--${variant}`, size !== 'md' && `btn--${size}`, block && 'btn--block', className]
    .filter(Boolean)
    .join(' ')
  return <button type={type} className={classes} {...rest} />
}
