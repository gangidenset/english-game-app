/**
 * 画面遷移の単位。
 * HOME → BATTLE → RESULT → REVIEW の流れを想定。
 * 現時点では HOME のみ実装。
 */
export type Screen = 'home' | 'battle' | 'result' | 'review'
