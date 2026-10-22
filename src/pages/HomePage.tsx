import { useProgress } from '../app/ProgressContext'
import { Button } from '../components/Button'
import { Card } from '../components/Card'
import { ProgressBar } from '../components/ProgressBar'
import { StatTile } from '../components/StatTile'
import { APP_CONFIG } from '../config/app'
import { getMissionStatuses, missionTitle } from '../services/missionService'
import { getAccuracy, getActiveStreak } from '../services/progressService'
import type { BattleConfig } from '../types/battle'
import { UpdatePrompt } from '../pwa/UpdatePrompt'
import { getLevelInfo } from '../utils/level'

interface Props {
  onStartBattle: (config: BattleConfig) => void
  onOpenStats: () => void
}

/** HOME 画面：レベル・XP・連続学習日数・今日のミッション・バトル開始。 */
export function HomePage({ onStartBattle, onOpenStats }: Props) {
  const { progress } = useProgress()
  const level = getLevelInfo(progress.totalXp)
  const streak = getActiveStreak(progress)
  const accuracy = getAccuracy(progress.stats.answered, progress.stats.correct)
  const missions = getMissionStatuses(progress.daily)
  const weakCount = Object.keys(progress.weak).length

  return (
    <main className="page home">
      <Card className="player">
        <div className="player__avatar" aria-hidden>
          <span className="player__lv">Lv</span>
          {level.level}
        </div>
        <div className="player__body">
          <p className="player__title">{level.title}</p>
          <ProgressBar value={level.xpInLevel} max={level.xpForNext} label="経験値" />
          <p className="player__xp">
            {level.xpInLevel} / {level.xpForNext} XP
            <span className="muted">　次のレベルまで {level.xpForNext - level.xpInLevel}</span>
          </p>
        </div>
      </Card>

      <div className="grid-3">
        <StatTile icon="🔥" label="連続学習" value={`${streak}日`} color="var(--color-combo)" />
        <StatTile icon="🎯" label="正答率" value={accuracy === null ? '--' : `${accuracy}%`} />
        <StatTile icon="🏆" label="ベスト" value={progress.stats.bestScore.toLocaleString()} />
      </div>

      <section className="missions" aria-labelledby="missions-title">
        <h2 id="missions-title" className="section-title">
          今日のミッション
        </h2>
        <Card className="missions__list">
          {missions.map(({ mission, progress: value, done }) => (
            <div key={mission.id} className={done ? 'mission mission--done' : 'mission'}>
              <span className="mission__icon" aria-hidden>
                {done ? '✔️' : mission.icon}
              </span>
              <div className="mission__body">
                <p className="mission__title">{missionTitle(mission)}</p>
                <ProgressBar
                  value={value}
                  max={mission.target}
                  height={6}
                  color={done ? 'var(--color-correct)' : 'var(--color-primary)'}
                />
              </div>
              <span className="mission__reward">
                {done ? 'クリア' : `${value}/${mission.target}`}
                <small>+{mission.rewardXp}XP</small>
              </span>
            </div>
          ))}
        </Card>
      </section>

      <div className="page-footer">
        <Button size="lg" block onClick={() => onStartBattle({ mode: 'mixed' })}>
          ⚔️ 英語バトル開始
        </Button>
        <div className="grid-3">
          <Button variant="secondary" size="sm" onClick={() => onStartBattle({ mode: 'vocabulary' })}>
            📘 単語
          </Button>
          <Button variant="secondary" size="sm" onClick={() => onStartBattle({ mode: 'grammar' })}>
            📗 文法
          </Button>
          <Button variant="secondary" size="sm" onClick={() => onStartBattle({ mode: 'phrases' })}>
            📙 熟語
          </Button>
        </div>
        <div className="grid-2">
          <Button variant="secondary" disabled={weakCount === 0} onClick={() => onStartBattle({ mode: 'weak' })}>
            💪 苦手克服 {weakCount > 0 && `(${weakCount})`}
          </Button>
          <Button variant="secondary" onClick={onOpenStats}>
            📊 学習記録
          </Button>
        </div>
        <p className="muted home__version">
          {APP_CONFIG.name} v{APP_CONFIG.version}
        </p>
      </div>
      <UpdatePrompt />
    </main>
  )
}
