import { describe, expect, it } from 'vitest'
import { selectQuestions, toBattleQuestion } from '../services/questionService'
import type { Question, QuestionCategory } from '../types/question'
import { seededRandom } from '../utils/random'

const make = (id: string, category: QuestionCategory = 'vocabulary'): Question => ({
  id,
  category,
  difficulty: 1,
  prompt: id,
  choices: ['a', 'b', 'c', 'd'],
  answerIndex: 2,
  explanation: '',
})

const pool = [
  ...Array.from({ length: 20 }, (_, i) => make(`voc-${i}`)),
  ...Array.from({ length: 20 }, (_, i) => make(`gra-${i}`, 'grammar')),
]

describe('toBattleQuestion', () => {
  it('選択肢をシャッフルしても正解の位置を追跡できる', () => {
    for (let seed = 0; seed < 20; seed++) {
      const bq = toBattleQuestion(make('x'), seededRandom(seed))
      expect(bq.choices[bq.answerIndex]).toBe('c')
      expect([...bq.choices].sort()).toEqual(['a', 'b', 'c', 'd'])
    }
  })
})

describe('selectQuestions', () => {
  it('指定数を重複なく選ぶ', () => {
    const qs = selectQuestions(pool, { mode: 'mixed' }, { count: 10 })
    expect(qs).toHaveLength(10)
    expect(new Set(qs.map((q) => q.source.id)).size).toBe(10)
  })

  it('カテゴリ別ではそのカテゴリだけを出す', () => {
    const qs = selectQuestions(pool, { mode: 'grammar' }, { count: 10 })
    expect(qs.every((q) => q.source.category === 'grammar')).toBe(true)
  })

  it('苦手問題を約3割混ぜる', () => {
    const weakIds = ['voc-1', 'voc-2', 'voc-3', 'voc-4', 'voc-5']
    const qs = selectQuestions(pool, { mode: 'mixed' }, { count: 10, weakIds })
    expect(qs.filter((q) => weakIds.includes(q.source.id))).toHaveLength(3)
  })

  it('苦手克服モードは苦手問題だけ', () => {
    const qs = selectQuestions(pool, { mode: 'weak' }, { count: 10, weakIds: ['gra-1', 'voc-9', 'none'] })
    expect(qs.map((q) => q.source.id).sort()).toEqual(['gra-1', 'voc-9'])
  })

  it('再挑戦モードは指定された問題だけ', () => {
    const qs = selectQuestions(pool, { mode: 'retry', questionIds: ['voc-3', 'gra-4'] }, { count: 10 })
    expect(qs.map((q) => q.source.id).sort()).toEqual(['gra-4', 'voc-3'])
  })
})
