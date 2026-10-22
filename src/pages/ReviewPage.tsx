import { Button } from '../components/Button'
import { Card } from '../components/Card'
import { TopBar } from '../components/TopBar'
import { wrongAnswers, type BattleResult } from '../game/result'
import { CATEGORY_LABELS } from '../types/question'

interface Props {
  result: BattleResult
  onRetry: (questionIds: string[]) => void
  onBack: () => void
}

/** REVIEW 画面：間違えた問題・正解・解説・再挑戦。 */
export function ReviewPage({ result, onRetry, onBack }: Props) {
  const wrong = wrongAnswers(result)

  return (
    <main className="page review">
      <TopBar onBack={onBack} title={`復習（${wrong.length}問）`} />

      {wrong.length === 0 ? (
        <Card>
          <p>間違えた問題はありません。すばらしい！</p>
        </Card>
      ) : (
        <ol className="review__list">
          {wrong.map(({ question, selectedIndex }, i) => (
            <li key={`${question.source.id}-${i}`}>
              <Card className="review-item">
                <span className="battle__category">{CATEGORY_LABELS[question.source.category]}</span>
                <p className="review-item__prompt">{question.source.prompt}</p>
                <p className="review-item__row review-item__row--wrong">
                  <span>あなたの答え</span>
                  {selectedIndex === null ? '⏰ 時間切れ' : `❌ ${question.choices[selectedIndex]}`}
                </p>
                <p className="review-item__row review-item__row--correct">
                  <span>正解</span>⭕ {question.choices[question.answerIndex]}
                </p>
                <p className="review-item__explanation">💡 {question.source.explanation}</p>
              </Card>
            </li>
          ))}
        </ol>
      )}

      <div className="page-footer review__footer">
        {wrong.length > 0 && (
          <Button size="lg" block onClick={() => onRetry(wrong.map((a) => a.question.source.id))}>
            🔁 間違えた問題に再挑戦
          </Button>
        )}
        <Button variant="secondary" block onClick={onBack}>
          結果に戻る
        </Button>
      </div>
    </main>
  )
}
