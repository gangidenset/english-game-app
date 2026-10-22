import { BATTLE, SCORE } from '../config/game'

/** コンボ数に応じた倍率（1 コンボ目は 1.0 倍、以降 +10% ずつ、最大 2.0 倍）。 */
export function comboMultiplier(combo: number): number {
  if (combo <= 1) return 1
  return 1 + Math.min((combo - 1) * SCORE.comboStep, SCORE.comboMaxBonus)
}

/**
 * 1 問正解したときの得点。
 * (基本点 + 残り秒数 × タイムボーナス) × コンボ倍率
 */
export function calcAnswerScore(elapsedMs: number, combo: number, limitMs: number = BATTLE.timePerQuestionMs): number {
  const remainingSec = Math.max(0, Math.floor((limitMs - elapsedMs) / 1000))
  const raw = SCORE.base + remainingSec * SCORE.timeBonusPerSecond
  return Math.round(raw * comboMultiplier(combo))
}
