export type ChoiceState = 'idle' | 'correct' | 'wrong' | 'dim'

interface Props {
  index: number
  label: string
  state: ChoiceState
  disabled: boolean
  onSelect: (index: number) => void
}

const MARKS = ['A', 'B', 'C', 'D']

/** 4択の選択肢ボタン。 */
export function ChoiceButton({ index, label, state, disabled, onSelect }: Props) {
  const cls = state === 'idle' ? 'choice' : `choice choice--${state}`
  return (
    <button type="button" className={cls} disabled={disabled} onClick={() => onSelect(index)}>
      <span className="choice__mark" aria-hidden>
        {state === 'correct' ? '○' : state === 'wrong' ? '×' : MARKS[index]}
      </span>
      <span>{label}</span>
    </button>
  )
}
