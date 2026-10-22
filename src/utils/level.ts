import { LEVEL_CURVE, LEVEL_TITLES } from '../config/game'

/** レベル n から n+1 に上がるのに必要な XP。 */
export function xpToNextLevel(level: number): number {
  return LEVEL_CURVE.base + (level - 1) * LEVEL_CURVE.step
}

export interface LevelInfo {
  level: number
  /** 現在のレベル内で獲得済みの XP */
  xpInLevel: number
  /** 次のレベルまでに必要な XP（このレベル内の合計） */
  xpForNext: number
  title: string
}

/** 累計 XP からレベル情報を求める。 */
export function getLevelInfo(totalXp: number): LevelInfo {
  let level = 1
  let rest = Math.max(0, Math.floor(totalXp))
  while (rest >= xpToNextLevel(level)) {
    rest -= xpToNextLevel(level)
    level++
  }
  return { level, xpInLevel: rest, xpForNext: xpToNextLevel(level), title: getLevelTitle(level) }
}

export function getLevelTitle(level: number): string {
  let title = LEVEL_TITLES[0].title
  for (const t of LEVEL_TITLES) {
    if (level >= t.minLevel) title = t.title
  }
  return title
}
