import type { BattleConfig } from '../types/battle'
import type { BattleQuestion, Question } from '../types/question'
import { shuffle } from '../utils/random'

/**
 * 問題データの読み込みと出題。
 *
 * src/data/*.json を動的 import で読み込むため、JSON ファイルを追加するだけで
 * 問題を増やせる（コードの変更は不要）。各ファイルは別チャンクになり、
 * 起動時ではなくバトル開始時に読み込まれる。
 */
const loaders = import.meta.glob<Question[]>('../data/*.json', { import: 'default' })

let cache: Promise<Question[]> | null = null

export function loadAllQuestions(): Promise<Question[]> {
  cache ??= Promise.all(Object.values(loaders).map((load) => load())).then((lists) => lists.flat())
  return cache
}

/** 選択肢の順番をシャッフルして出題用の形にする。 */
export function toBattleQuestion(q: Question, random: () => number = Math.random): BattleQuestion {
  const order = shuffle(
    q.choices.map((_, i) => i),
    random,
  )
  return {
    source: q,
    choices: order.map((i) => q.choices[i]),
    answerIndex: order.indexOf(q.answerIndex),
  }
}

export interface PickOptions {
  count: number
  /** 苦手問題の ID（優先的に混ぜる） */
  weakIds?: string[]
  random?: () => number
}

/** 苦手問題を混ぜる割合（ミックス / カテゴリ別バトル） */
const WEAK_MIX_RATIO = 0.3

/** バトルの種類に応じて出題する問題を選ぶ（純粋関数）。 */
export function selectQuestions(
  all: Question[],
  config: BattleConfig,
  { count, weakIds = [], random = Math.random }: PickOptions,
): BattleQuestion[] {
  const byId = new Map(all.map((q) => [q.id, q]))
  const fromIds = (ids: string[]) => ids.map((id) => byId.get(id)).filter((q): q is Question => !!q)

  let picked: Question[]
  switch (config.mode) {
    case 'retry':
      picked = shuffle(fromIds(config.questionIds ?? []), random)
      break
    case 'weak':
      picked = shuffle(fromIds(weakIds), random).slice(0, count)
      break
    default: {
      const pool = config.mode === 'mixed' ? all : all.filter((q) => q.category === config.mode)
      const weakSet = new Set(weakIds)
      const weakPool = shuffle(
        pool.filter((q) => weakSet.has(q.id)),
        random,
      ).slice(0, Math.floor(count * WEAK_MIX_RATIO))
      const used = new Set(weakPool.map((q) => q.id))
      const rest = shuffle(
        pool.filter((q) => !used.has(q.id)),
        random,
      ).slice(0, count - weakPool.length)
      picked = shuffle([...weakPool, ...rest], random)
    }
  }
  return picked.map((q) => toBattleQuestion(q, random))
}
