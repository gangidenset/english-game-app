import { BATTLE } from '../config/game'
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
  lives: number
  /** ライフが 0 になって終了した */
  gameOver: boolean
  /** 途中でやめた */
  quit: boolean
}

export type BattleAction =
  | { type: 'answer'; choiceIndex: number; elapsedMs: number }
  | { type: 'timeout'; elapsedMs: number }
  | { type: 'next' }
  | { type: 'quit' }

export function createBattleState(questions: BattleQuestion[], maxLives: number = BATTLE.maxLives): BattleState {
  return {
    questions,
    index: 0,
    phase: questions.length > 0 ? 'answering' : 'finished',
    answers: [],
    lives: maxLives,
    gameOver: false,
    quit: false,
  }
}

/** 回答（時間切れ含む）を記録し、ライフを更新する。 */
function recordAnswer(state: BattleState, selectedIndex: number | null, elapsedMs: number): BattleState {
  const question = state.questions[state.index]
  const correct = selectedIndex === question.answerIndex
  return {
    ...state,
    phase: 'feedback',
    lives: correct ? state.lives : Math.max(0, state.lives - 1),
    answers: [...state.answers, { question, selectedIndex, correct, timeMs: elapsedMs }],
  }
}

export function battleReducer(state: BattleState, action: BattleAction): BattleState {
  switch (action.type) {
    case 'answer':
      if (state.phase !== 'answering') return state
      return recordAnswer(state, action.choiceIndex, action.elapsedMs)
    case 'timeout':
      if (state.phase !== 'answering') return state
      return recordAnswer(state, null, action.elapsedMs)
    case 'next': {
      if (state.phase !== 'feedback') return state
      if (state.lives <= 0) return { ...state, phase: 'finished', gameOver: true }
      const nextIndex = state.index + 1
      if (nextIndex >= state.questions.length) return { ...state, phase: 'finished' }
      return { ...state, index: nextIndex, phase: 'answering' }
    }
    case 'quit':
      return { ...state, phase: 'finished', quit: true }
  }
}

/** 直前の回答（フィードバック表示中の問題の回答） */
export function lastAnswer(state: BattleState): AnswerRecord | undefined {
  return state.answers[state.answers.length - 1]
}
