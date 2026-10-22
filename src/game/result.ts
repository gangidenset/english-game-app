import { RANK_THRESHOLDS, XP } from '../config/game'
import type { BattleConfig, Rank } from '../types/battle'
import type { AnswerRecord, BattleState } from './battleReducer'

export interface XpBreakdown {
  correct: number
  score: number
  clear: number
  perfect: number
  total: number
}

/** 1 回のバトルの結果。RESULT / REVIEW 画面と学習履歴の保存に使う。 */
export interface BattleResult {
  config: BattleConfig
  answers: AnswerRecord[]
  /** 出題予定だった問題数 */
  totalQuestions: number
  correctCount: number
  /** 回答した問題に対する正答率（%） */
  accuracy: number
  score: number
  maxCombo: number
  rank: Rank
  /** 最後まで解き切った（ゲームオーバーではない） */
  cleared: boolean
  /** 全問正解 */
  perfect: boolean
  xp: XpBreakdown
  durationMs: number
}

export function calcRank(accuracy: number, cleared: boolean): Rank {
  const rank = RANK_THRESHOLDS.find((t) => accuracy >= t.minAccuracy)?.rank ?? 'D'
  if (!cleared && (rank === 'S' || rank === 'A' || rank === 'B')) return 'C'
  return rank
}

/** ランクを数値化（S=5 … D=1）。ミッション判定などに使う。 */
export function rankScore(rank: Rank): number {
  return { S: 5, A: 4, B: 3, C: 2, D: 1 }[rank]
}

export function calcXp(correctCount: number, score: number, cleared: boolean, perfect: boolean): XpBreakdown {
  const xp = {
    correct: correctCount * XP.perCorrect,
    score: Math.floor(score / XP.scoreDivisor),
    clear: cleared ? XP.clearBonus : 0,
    perfect: perfect ? XP.perfectBonus : 0,
  }
  return { ...xp, total: xp.correct + xp.score + xp.clear + xp.perfect }
}

export function buildBattleResult(state: BattleState, config: BattleConfig, durationMs: number): BattleResult {
  const correctCount = state.answers.filter((a) => a.correct).length
  const answered = state.answers.length
  const accuracy = answered > 0 ? Math.round((correctCount / answered) * 100) : 0
  const cleared = !state.gameOver && !state.quit && answered === state.questions.length
  const perfect = cleared && correctCount === state.questions.length
  return {
    config,
    answers: state.answers,
    totalQuestions: state.questions.length,
    correctCount,
    accuracy,
    score: state.score,
    maxCombo: state.maxCombo,
    rank: calcRank(accuracy, cleared),
    cleared,
    perfect,
    xp: calcXp(correctCount, state.score, cleared, perfect),
    durationMs,
  }
}

/** 間違えた（時間切れを含む）回答 */
export function wrongAnswers(result: BattleResult): AnswerRecord[] {
  return result.answers.filter((a) => !a.correct)
}
