import { describe, expect, it } from 'vitest'
import { calcRank, calcXp } from '../game/result'

describe('ランク', () => {
  it('正答率で決まる', () => {
    expect(calcRank(100, true)).toBe('S')
    expect(calcRank(90, true)).toBe('S')
    expect(calcRank(80, true)).toBe('A')
    expect(calcRank(60, true)).toBe('B')
    expect(calcRank(40, true)).toBe('C')
    expect(calcRank(39, true)).toBe('D')
  })

  it('ゲームオーバー時は最高 C', () => {
    expect(calcRank(100, false)).toBe('C')
    expect(calcRank(20, false)).toBe('D')
  })
})

describe('獲得 XP', () => {
  it('正解・スコア・クリア・パーフェクトの合計', () => {
    expect(calcXp(10, 2500, true, true)).toEqual({ correct: 100, score: 25, clear: 20, perfect: 30, total: 175 })
    expect(calcXp(3, 499, false, false)).toEqual({ correct: 30, score: 4, clear: 0, perfect: 0, total: 34 })
  })
})
