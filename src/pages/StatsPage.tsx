import { useEffect, useState } from 'react'
import { useProgress } from '../app/ProgressContext'
import { Button } from '../components/Button'
import { Card } from '../components/Card'
import { ProgressBar } from '../components/ProgressBar'
import { StatTile } from '../components/StatTile'
import { TopBar } from '../components/TopBar'
import { APP_CONFIG } from '../config/app'
import { loadAllQuestions } from '../services/questionService'
import { getAccuracy, getActiveStreak } from '../services/progressService'
import type { BattleMode } from '../types/battle'
import { CATEGORY_LABELS, type Question, type QuestionCategory } from '../types/question'
import { formatDuration } from '../utils/date'

const MODE_LABELS: Record<BattleMode, string> = {
  mixed: 'ミックス',
  vocabulary: '単語',
  grammar: '文法',
  phrases: '熟語',
  weak: '苦手克服',
  retry: '再挑戦',
}

const CATEGORIES = Object.keys(CATEGORY_LABELS) as QuestionCategory[]

/** 学習記録画面：累計の成績・分野別正答率・苦手問題・最近のバトル・データ管理。 */
export function StatsPage({ onBack }: { onBack: () => void }) {
  const { progress, resetProgress, updateSettings } = useProgress()
  const { stats } = progress
  const accuracy = getAccuracy(stats.answered, stats.correct)
  const weakList = Object.values(progress.weak)
    .sort((a, b) => b.wrongCount - a.wrongCount)
    .slice(0, 5)

  const [questionsById, setQuestionsById] = useState<Map<string, Question>>(new Map())
  useEffect(() => {
    loadAllQuestions().then((all) => setQuestionsById(new Map(all.map((q) => [q.id, q]))))
  }, [])

  const reset = async () => {
    if (window.confirm('学習データ（レベル・XP・記録）をすべて消去します。よろしいですか？')) {
      await resetProgress()
    }
  }

  return (
    <main className="page stats">
      <TopBar onBack={onBack} title="学習記録" />

      <div className="grid-2">
        <StatTile icon="⚔️" label="バトル回数" value={stats.battles} />
        <StatTile icon="📝" label="回答した問題" value={stats.answered} />
        <StatTile icon="🎯" label="正答率" value={accuracy === null ? '--' : `${accuracy}%`} />
        <StatTile icon="⏱" label="学習時間" value={formatDuration(stats.studyTimeMs)} />
        <StatTile icon="🏆" label="ベストスコア" value={stats.bestScore.toLocaleString()} />
        <StatTile icon="🔥" label="最大コンボ" value={stats.bestCombo} />
        <StatTile icon="📅" label="連続学習（現在）" value={`${getActiveStreak(progress)}日`} />
        <StatTile icon="👑" label="連続学習（最長）" value={`${progress.streak.best}日`} />
      </div>

      <section className="stats__section">
        <h2 className="section-title">分野別の正答率</h2>
        <Card className="stats__cats">
          {CATEGORIES.map((cat) => {
            const c = stats.byCategory[cat]
            const acc = getAccuracy(c.answered, c.correct)
            return (
              <div key={cat} className="stats__cat">
                <span>{CATEGORY_LABELS[cat]}</span>
                <ProgressBar value={acc ?? 0} max={100} color="var(--color-correct)" label={`${CATEGORY_LABELS[cat]}の正答率`} />
                <span className="stats__num">{acc === null ? '--' : `${acc}%`}</span>
              </div>
            )
          })}
        </Card>
      </section>

      <section className="stats__section">
        <h2 className="section-title">苦手な問題（{Object.keys(progress.weak).length}問）</h2>
        <Card>
          {weakList.length === 0 ? (
            <p className="muted">まだありません。間違えた問題がここに記録されます。</p>
          ) : (
            <ul className="stats__list">
              {weakList.map((w) => (
                <li key={w.id}>
                  <span className="stats__prompt">{questionsById.get(w.id)?.prompt ?? w.id}</span>
                  <span className="stats__num">×{w.wrongCount}</span>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </section>

      <section className="stats__section">
        <h2 className="section-title">最近のバトル</h2>
        <Card>
          {progress.history.length === 0 ? (
            <p className="muted">まだバトルの記録がありません。</p>
          ) : (
            <ul className="stats__list">
              {progress.history.slice(0, 10).map((h) => (
                <li key={h.at}>
                  <span className={`stats__rank rank--${h.rank}`}>{h.rank}</span>
                  <span className="stats__prompt">
                    {new Date(h.at).toLocaleDateString('ja-JP', { month: 'numeric', day: 'numeric' })}{' '}
                    {MODE_LABELS[h.mode]}　{h.correct}/{h.total}問
                  </span>
                  <span className="stats__num">{h.score.toLocaleString()}pt</span>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </section>

      <section className="stats__section">
        <h2 className="section-title">設定</h2>
        <Card className="settings">
          <label className="toggle">
            <span>🔊 効果音</span>
            <input
              type="checkbox"
              checked={progress.settings.sound}
              onChange={(e) => updateSettings({ sound: e.target.checked })}
            />
          </label>
          <label className="toggle">
            <span>📳 バイブレーション</span>
            <input
              type="checkbox"
              checked={progress.settings.vibration}
              onChange={(e) => updateSettings({ vibration: e.target.checked })}
            />
          </label>
        </Card>
      </section>

      <section className="stats__section">
        <h2 className="section-title">データ</h2>
        <p className="muted">学習データはこの端末の中だけに保存されています。</p>
        <Button variant="danger" block onClick={reset}>
          学習データをリセット
        </Button>
        <p className="stats__links muted">
          <a href={APP_CONFIG.privacyPolicyUrl} target="_blank" rel="noopener noreferrer">
            プライバシーポリシー
          </a>
          　v{APP_CONFIG.version}
        </p>
      </section>
    </main>
  )
}
