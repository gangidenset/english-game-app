import type { MissionDefinition } from '../types/mission'

/**
 * 今日のミッションの候補。毎日この中から日付をもとに DAILY_MISSION_COUNT 個を選ぶ。
 * 先頭の "daily-battle" は毎日必ず含める（毎日続ける習慣づけのため）。
 */
export const MISSION_POOL: MissionDefinition[] = [
  {
    id: 'daily-battle',
    title: 'バトルを{n}回プレイ',
    icon: '⚔️',
    target: 1,
    rewardXp: 20,
    measure: (d) => d.battles,
  },
  {
    id: 'correct-20',
    title: '合計{n}問正解する',
    icon: '✅',
    target: 20,
    rewardXp: 30,
    measure: (d) => d.correct,
  },
  {
    id: 'combo-5',
    title: '{n}コンボを達成',
    icon: '🔥',
    target: 5,
    rewardXp: 30,
    measure: (d) => d.maxCombo,
  },
  {
    id: 'clear-2',
    title: 'バトルを{n}回クリア',
    icon: '🛡️',
    target: 2,
    rewardXp: 30,
    measure: (d) => d.clearedBattles,
  },
  {
    id: 'grammar-8',
    title: '文法問題を{n}問正解',
    icon: '📗',
    target: 8,
    rewardXp: 25,
    measure: (d) => d.categoryCorrect.grammar,
  },
  {
    id: 'vocab-8',
    title: '単語問題を{n}問正解',
    icon: '📘',
    target: 8,
    rewardXp: 25,
    measure: (d) => d.categoryCorrect.vocabulary,
  },
  {
    id: 'phrase-5',
    title: '熟語・会話問題を{n}問正解',
    icon: '📙',
    target: 5,
    rewardXp: 25,
    measure: (d) => d.categoryCorrect.phrases,
  },
  {
    id: 'rank-a',
    title: 'ランクA以上をとる',
    icon: '🏅',
    target: 1,
    rewardXp: 40,
    // bestRankScore: S=5, A=4, B=3 ...  A 以上なら 1
    measure: (d) => (d.bestRankScore >= 4 ? 1 : 0),
  },
]
