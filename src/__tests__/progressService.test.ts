import { describe, expect, it } from 'vitest'
import { buildBattleResult } from '../game/result'
import { battleReducer, createBattleState } from '../game/battleReducer'
import { applyBattleResult, createInitialProgress, migrate, updateStreak } from '../services/progressService'
import type { BattleQuestion } from '../types/question'

const q = (id: string): BattleQuestion => ({
  source: { id, category: 'grammar', difficulty: 1, prompt: id, choices: ['a', 'b', 'c', 'd'], answerIndex: 0, explanation: '' },
  choices: ['a', 'b', 'c', 'd'],
  answerIndex: 0,
})

/** choices[i] を順に回答したバトル結果を作る */
function play(ids: string[], picks: number[]) {
  let s = createBattleState(ids.map(q), 3)
  for (const choiceIndex of picks) {
    s = battleReducer(s, { type: 'answer', choiceIndex, elapsedMs: 5000 })
    s = battleReducer(s, { type: 'next' })
  }
  return buildBattleResult(s, { mode: 'mixed' }, 60_000)
}

const day = (d: string) => new Date(`${d}T12:00:00`)

describe('連続学習日数', () => {
  it('昨日も学習していれば +1、空いたら 1 に戻る、同日は変化なし', () => {
    let s = updateStreak({ current: 0, best: 0, lastStudyDate: null }, '2026-10-20')
    expect(s).toEqual({ current: 1, best: 1, lastStudyDate: '2026-10-20' })
    s = updateStreak(s, '2026-10-21')
    expect(s.current).toBe(2)
    expect(updateStreak(s, '2026-10-21')).toBe(s)
    s = updateStreak(s, '2026-10-25')
    expect(s).toEqual({ current: 1, best: 2, lastStudyDate: '2026-10-25' })
  })
})

describe('applyBattleResult', () => {
  it('XP・統計・苦手問題・履歴・ミッションを更新する', () => {
    const start = createInitialProgress('2026-10-22')
    const result = play(['1', '2', '3'], [0, 1, 0])
    const out = applyBattleResult(start, result, day('2026-10-22'))
    const p = out.progress

    expect(p.stats).toMatchObject({ battles: 1, answered: 3, correct: 2, studyTimeMs: 60_000 })
    expect(p.stats.byCategory.grammar).toEqual({ answered: 3, correct: 2 })
    expect(Object.keys(p.weak)).toEqual(['2'])
    expect(p.history).toHaveLength(1)
    expect(p.streak.current).toBe(1)
    // 「バトルを1回プレイ」は毎日のミッションなので必ず達成
    expect(out.completedMissions.map((m) => m.id)).toContain('daily-battle')
    const missionXp = out.completedMissions.reduce((s, m) => s + m.rewardXp, 0)
    expect(p.totalXp).toBe(result.xp.total + missionXp)
    expect(out.xpGained).toBe(p.totalXp)
  })

  it('ミッション報酬は 1 日 1 回だけ', () => {
    const first = applyBattleResult(createInitialProgress('2026-10-22'), play(['1'], [0]), day('2026-10-22'))
    const second = applyBattleResult(first.progress, play(['1'], [0]), day('2026-10-22'))
    expect(second.completedMissions.map((m) => m.id)).not.toContain('daily-battle')
  })

  it('日付が変わると今日の記録がリセットされる', () => {
    const first = applyBattleResult(createInitialProgress('2026-10-22'), play(['1'], [0]), day('2026-10-22'))
    const next = applyBattleResult(first.progress, play(['1'], [0]), day('2026-10-23'))
    expect(next.progress.daily).toMatchObject({ date: '2026-10-23', battles: 1 })
    expect(next.completedMissions.map((m) => m.id)).toContain('daily-battle')
    expect(next.progress.streak.current).toBe(2)
  })

  it('苦手問題は 2 回続けて正解すると外れる', () => {
    let p = applyBattleResult(createInitialProgress(), play(['1'], [1])).progress
    expect(p.weak['1'].wrongCount).toBe(1)
    p = applyBattleResult(p, play(['1'], [0])).progress
    expect(p.weak['1'].correctStreak).toBe(1)
    p = applyBattleResult(p, play(['1'], [0])).progress
    expect(p.weak['1']).toBeUndefined()
  })
})

describe('migrate', () => {
  it('壊れた・古いデータでも初期値で補う', () => {
    expect(migrate(null).totalXp).toBe(0)
    const m = migrate({ totalXp: 500, stats: { battles: 3 } })
    expect(m.totalXp).toBe(500)
    expect(m.stats.battles).toBe(3)
    expect(m.stats.byCategory.vocabulary).toEqual({ answered: 0, correct: 0 })
    expect(m.settings.sound).toBe(true)
  })
})
