import { DAILY_MISSION_COUNT } from '../config/game'
import { MISSION_POOL } from '../config/missions'
import type { MissionDefinition, MissionStatus } from '../types/mission'
import type { DailyRecord } from '../types/progress'
import { hashString, seededRandom, shuffle } from '../utils/random'

/** その日のミッションを選ぶ。同じ日付なら必ず同じ組み合わせになる。 */
export function getDailyMissions(dateKey: string): MissionDefinition[] {
  const [fixed, ...rest] = MISSION_POOL
  const picked = shuffle(rest, seededRandom(hashString(dateKey))).slice(0, DAILY_MISSION_COUNT - 1)
  return [fixed, ...picked]
}

export function getMissionStatuses(daily: DailyRecord): MissionStatus[] {
  return getDailyMissions(daily.date).map((mission) => {
    const progress = Math.min(mission.target, mission.measure(daily))
    return {
      mission,
      progress,
      done: progress >= mission.target,
      claimed: daily.claimedMissionIds.includes(mission.id),
    }
  })
}

export function missionTitle(mission: MissionDefinition): string {
  return mission.title.replace('{n}', String(mission.target))
}
