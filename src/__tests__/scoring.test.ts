import { describe, expect, it } from 'vitest'
import { calcAnswerScore, comboMultiplier } from '../game/scoring'
import { battleReducer, createBattleState } from '../game/battleReducer'
import type { BattleQuestion } from '../types/question'

describe('スコア計算', () => {
  it('コンボ倍率は 1.0 から 0.1 ずつ増え、最大 2.0', () => {
    expect(comboMultiplier(0)).toBe(1)
    expect(comboMultiplier(1)).toBe(1)
    expect(comboMultiplier(3)).toBeCloseTo(1.2)
    expect(comboMultiplier(11)).toBeCloseTo(2)
    expect(comboMultiplier(50)).toBeCloseTo(2)
  })

  it('残り時間ボーナスとコンボ倍率をかける', () => {
    // 残り 12 秒: (100 + 12*10) * 1.0
    expect(calcAnswerScore(3000, 1, 15000)).toBe(220)
    // 残り 0 秒・3 コンボ: 100 * 1.2
    expect(calcAnswerScore(15000, 3, 15000)).toBe(120)
  })

  it('不正解でコンボが切れ、最大コンボは残る', () => {
    const q: BattleQuestion = {
      source: { id: 'x', category: 'grammar', difficulty: 1, prompt: '', choices: ['a', 'b', 'c', 'd'], answerIndex: 0, explanation: '' },
      choices: ['a', 'b', 'c', 'd'],
      answerIndex: 0,
    }
    let s = createBattleState([q, q, q, q], 3)
    for (const choice of [0, 0, 1, 0]) {
      s = battleReducer(s, { type: 'answer', choiceIndex: choice, elapsedMs: 15000 })
      s = battleReducer(s, { type: 'next' })
    }
    expect(s.answers.map((a) => a.combo)).toEqual([1, 2, 0, 1])
    expect(s.maxCombo).toBe(2)
    expect(s.combo).toBe(1)
    expect(s.score).toBe(100 + 110 + 0 + 100)
  })
})
