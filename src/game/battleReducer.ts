import type { BattleQuestion } from '../types/question'

/**
 * バトルの進行ロジック（純粋関数の reducer）。
 * 画面（BattlePage）から切り離しているので、単体テストしやすく、
 * 将来ルールを追加するときもここだけを変更すればよい。
 */

export interface AnswerRecord {
  question: BattleQuestion
  /** 選んだ選択肢。時間切れなら null */
  selectedIndex: number | null
  correct: boolean
  /** 回答にかかった時間 */
  timeMs: number
}

export type BattlePhase = 'answering' | 'feedback' | 'finished'

export interface BattleState {
  questions: BattleQuestion[]
  index: number
  phase: BattlePhase
  answers: AnswerRecord[]
}

export type BattleAction =
  | { type: 'answer'; choiceIndex: number; elapsedMs: number }
  | { type: 'next' }
  | { type: 'quit' }

export function createBattleState(questions: BattleQuestion[]): BattleState {
  return {
    questions,
    index: 0,
    phase: questions.length > 0 ? 'answering' : 'finished',
    answers: [],
  }
}

export function battleReducer(state: BattleState, action: BattleAction): BattleState {
  switch (action.type) {
    case 'answer': {
      if (state.phase !== 'answering') return state
      const question = state.questions[state.index]
      const correct = action.choiceIndex === question.answerIndex
      return {
        ...state,
        phase: 'feedback',
        answers: [
          ...state.answers,
          { question, selectedIndex: action.choiceIndex, correct, timeMs: action.elapsedMs },
        ],
      }
    }
    case 'next': {
      if (state.phase !== 'feedback') return state
      const nextIndex = state.index + 1
      if (nextIndex >= state.questions.length) return { ...state, phase: 'finished' }
      return { ...state, index: nextIndex, phase: 'answering' }
    }
    case 'quit':
      return { ...state, phase: 'finished' }
  }
}

/** 直前の回答（フィードバック表示中の問題の回答） */
export function lastAnswer(state: BattleState): AnswerRecord | undefined {
  return state.answers[state.answers.length - 1]
}
