import { describe, expect, it } from 'vitest'
import { readdirSync, readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { join } from 'node:path'
import type { Question } from '../types/question'

/**
 * 問題データ（src/data/*.json）の検証。
 * 問題を追加したら `npm test` で形式ミスや ID の重複がないか確認できる。
 */
const dataDir = fileURLToPath(new URL('../data', import.meta.url))
const files = readdirSync(dataDir).filter((f) => f.endsWith('.json'))
const all: { file: string; q: Question }[] = files.flatMap((file) =>
  (JSON.parse(readFileSync(join(dataDir, file), 'utf8')) as Question[]).map((q) => ({ file, q })),
)

const PREFIX: Record<string, string> = { vocabulary: 'voc', grammar: 'gra', phrases: 'phr' }

describe('問題データ', () => {
  it('100問以上ある', () => {
    expect(all.length).toBeGreaterThanOrEqual(100)
  })

  it('ID が全ファイルで一意', () => {
    const ids = all.map(({ q }) => q.id)
    const dup = ids.filter((id, i) => ids.indexOf(id) !== i)
    expect(dup).toEqual([])
  })

  it.each(all.map(({ file, q }) => [`${file} ${q.id}`, q] as const))('%s の形式が正しい', (_, q) => {
    expect(q.id).toMatch(new RegExp(`^${PREFIX[q.category]}-\\d{4}$`))
    expect([1, 2, 3, 4, 5]).toContain(q.difficulty)
    expect(q.prompt.trim()).not.toBe('')
    expect(q.explanation.trim()).not.toBe('')
    expect(q.choices).toHaveLength(4)
    expect(new Set(q.choices.map((c) => c.trim())).size).toBe(4)
    expect(q.choices.every((c) => c.trim() !== '')).toBe(true)
    expect(Number.isInteger(q.answerIndex) && q.answerIndex >= 0 && q.answerIndex < 4).toBe(true)
  })
})
