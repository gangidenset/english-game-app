import { describe, expect, it } from 'vitest'
import { battleReducer, createBattleState, type BattleState } from '../game/battleReducer'
import type { BattleQuestion } from '../types/question'

const q = (id: string): BattleQuestion => ({
  source: {
    id,
    category: 'grammar',
    difficulty: 1,
    prompt: id,
    choices: ['a', 'b', 'c', 'd'],
    answerIndex: 0,
    explanation: '',
  },
  choices: ['a', 'b', 'c', 'd'],
  answerIndex: 0,
})

const questions = [q('1'), q('2'), q('3'), q('4'), q('5')]
const answer = (s: BattleState, choiceIndex: number, elapsedMs = 3000) =>
  battleReducer(battleReducer(s, { type: 'answer', choiceIndex, elapsedMs }), { type: 'next' })

describe('battleReducer', () => {
  it('全問回答すると終了する', () => {
    let s = createBattleState(questions, 3)
    for (let i = 0; i < 5; i++) s = answer(s, 0)
    expect(s.phase).toBe('finished')
    expect(s.gameOver).toBe(false)
    expect(s.answers.every((a) => a.correct)).toBe(true)
  })

  it('不正解・時間切れでライフが減り、0 でゲームオーバー', () => {
    let s = createBattleState(questions, 2)
    s = answer(s, 1)
    expect(s.lives).toBe(1)
    s = battleReducer(s, { type: 'timeout', elapsedMs: 15000 })
    expect(s.answers[1]).toMatchObject({ selectedIndex: null, correct: false })
    expect(s.lives).toBe(0)
    s = battleReducer(s, { type: 'next' })
    expect(s).toMatchObject({ phase: 'finished', gameOver: true })
    expect(s.answers).toHaveLength(2)
  })

  it('フィードバック中の二重回答は無視する', () => {
    let s = createBattleState(questions, 3)
    s = battleReducer(s, { type: 'answer', choiceIndex: 0, elapsedMs: 1 })
    const again = battleReducer(s, { type: 'answer', choiceIndex: 1, elapsedMs: 1 })
    expect(again).toBe(s)
    expect(battleReducer(s, { type: 'timeout', elapsedMs: 1 })).toBe(s)
  })
})
