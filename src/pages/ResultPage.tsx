import { Button } from '../components/Button'
import { Card } from '../components/Card'
import { RankBadge } from '../components/RankBadge'
import { StatTile } from '../components/StatTile'
import { wrongAnswers, type BattleResult } from '../game/result'
import { missionTitle } from '../services/missionService'
import type { BattleOutcome } from '../services/progressService'
import { getLevelTitle } from '../utils/level'

interface Props {
  result: BattleResult
  outcome: BattleOutcome
  onRetry: () => void
  onReview: () => void
  onHome: () => void
}

const RANK_MESSAGES = {
  S: 'パーフェクトに近い！入試本番も怖くない！',
  A: 'すばらしい！あと少しで S ランク！',
  B: 'いい調子！苦手を復習してレベルアップ！',
  C: 'もう一息！解説を読んで再挑戦しよう！',
  D: 'ここからが伸びしろ！復習から始めよう！',
} as const

/** RESULT 画面：正解数・正答率・スコア・最大コンボ・ランク・獲得 XP。 */
export function ResultPage({ result, outcome, onRetry, onReview, onHome }: Props) {
  const wrongCount = wrongAnswers(result).length

  return (
    <main className="page result">
      <div className="result__head">
        <p className={result.cleared ? 'result__status' : 'result__status result__status--over'}>
          {result.perfect ? '🎉 パーフェクト！' : result.cleared ? '🏁 バトルクリア！' : '💥 ゲームオーバー'}
        </p>
        <RankBadge rank={result.rank} />
        <p className="result__message">{RANK_MESSAGES[result.rank]}</p>
      </div>

      <div className="grid-2">
        <StatTile icon="✅" label="正解数" value={`${result.correctCount} / ${result.totalQuestions}`} />
        <StatTile icon="🎯" label="正答率" value={`${result.accuracy}%`} />
        <StatTile icon="⭐" label="スコア" value={result.score.toLocaleString()} color="var(--color-primary)" />
        <StatTile icon="🔥" label="最大コンボ" value={result.maxCombo} color="var(--color-combo)" />
      </div>

      <Card className="xp-card">
        <p className="xp-card__total">
          獲得 XP <strong>+{outcome.xpGained}</strong>
        </p>
        <ul className="xp-card__list">
          <li>
            正解ボーナス <span>+{result.xp.correct}</span>
          </li>
          <li>
            スコアボーナス <span>+{result.xp.score}</span>
          </li>
          {result.xp.clear > 0 && (
            <li>
              クリアボーナス <span>+{result.xp.clear}</span>
            </li>
          )}
          {result.xp.perfect > 0 && (
            <li>
              パーフェクトボーナス <span>+{result.xp.perfect}</span>
            </li>
          )}
          {outcome.completedMissions.map((m) => (
            <li key={m.id}>
              🎯 ミッション「{missionTitle(m)}」 <span>+{m.rewardXp}</span>
            </li>
          ))}
        </ul>
      </Card>

      {outcome.levelAfter > outcome.levelBefore && (
        <Card className="levelup" role="status">
          <p className="levelup__title">⬆️ LEVEL UP!</p>
          <p>
            Lv.{outcome.levelBefore} → <strong>Lv.{outcome.levelAfter}</strong>　{getLevelTitle(outcome.levelAfter)}
          </p>
        </Card>
      )}

      <div className="page-footer">
        {wrongCount > 0 && (
          <Button size="lg" block onClick={onReview}>
            📝 間違えた問題を復習（{wrongCount}問）
          </Button>
        )}
        <div className="grid-2">
          <Button variant="secondary" onClick={onRetry}>
            🔁 もう一度
          </Button>
          <Button variant="secondary" onClick={onHome}>
            🏠 ホーム
          </Button>
        </div>
      </div>
    </main>
  )
}
