import { describe, expect, it } from 'vitest'
import { getLevelInfo, xpToNextLevel } from '../utils/level'
import { daysBetween } from '../utils/date'
import { getDailyMissions } from '../services/missionService'

describe('レベル計算', () => {
  it('必要 XP は 100, 150, 200 ... と増える', () => {
    expect([1, 2, 3].map(xpToNextLevel)).toEqual([100, 150, 200])
  })

  it('累計 XP からレベルを求める', () => {
    expect(getLevelInfo(0)).toMatchObject({ level: 1, xpInLevel: 0, xpForNext: 100 })
    expect(getLevelInfo(99).level).toBe(1)
    expect(getLevelInfo(100)).toMatchObject({ level: 2, xpInLevel: 0 })
    expect(getLevelInfo(260)).toMatchObject({ level: 3, xpInLevel: 10, xpForNext: 200 })
  })
})

describe('日付', () => {
  it('月またぎ・うるう年の日数差', () => {
    expect(daysBetween('2026-01-31', '2026-02-01')).toBe(1)
    expect(daysBetween('2028-02-28', '2028-03-01')).toBe(2)
    expect(daysBetween('2026-10-22', '2026-10-22')).toBe(0)
  })
})

describe('今日のミッション', () => {
  it('同じ日は同じミッション、毎日「バトル1回」を含む', () => {
    const a = getDailyMissions('2026-10-22').map((m) => m.id)
    expect(getDailyMissions('2026-10-22').map((m) => m.id)).toEqual(a)
    expect(a).toHaveLength(3)
    expect(a[0]).toBe('daily-battle')
    expect(new Set(a).size).toBe(3)
  })
})
