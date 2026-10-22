import type { DailyRecord } from './progress'

export interface MissionDefinition {
  id: string
  /** 画面に表示する文言。{n} は target に置き換わる */
  title: string
  icon: string
  target: number
  rewardXp: number
  /** 今日の記録から進捗値を取り出す */
  measure: (daily: DailyRecord) => number
}

export interface MissionStatus {
  mission: MissionDefinition
  progress: number
  done: boolean
  claimed: boolean
}
