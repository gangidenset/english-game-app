import { useCallback, useEffect, useReducer, useRef, useState } from 'react'
import { useProgress } from '../app/ProgressContext'
import { Button } from '../components/Button'
import { Card } from '../components/Card'
import { Lives } from '../components/Lives'
import { TimerBar } from '../components/TimerBar'
import { ChoiceButton, type ChoiceState } from '../components/ChoiceButton'
import { ProgressBar } from '../components/ProgressBar'
import { TopBar } from '../components/TopBar'
import { BATTLE } from '../config/game'
import {
  battleReducer,
  createBattleState,
  lastAnswer,
  type BattleState,
} from '../game/battleReducer'
import { useCountdown } from '../hooks/useCountdown'
import { loadAllQuestions, selectQuestions } from '../services/questionService'
import type { BattleConfig } from '../types/battle'
import { CATEGORY_LABELS, type BattleQuestion } from '../types/question'

interface Props {
  config: BattleConfig
  onFinish: (state: BattleState) => void
  onQuit: () => void
}

/** BATTLE 画面：問題の読み込み → 進行。 */
export function BattlePage({ config, onFinish, onQuit }: Props) {
  const { progress } = useProgress()
  const [questions, setQuestions] = useState<BattleQuestion[] | null>(null)
  // 出題はバトル開始時点の苦手問題で一度だけ決める
  const [weakIds] = useState(() => Object.keys(progress.weak))

  useEffect(() => {
    let active = true
    loadAllQuestions().then((all) => {
      if (!active) return
      setQuestions(
        selectQuestions(all, config, {
          count: BATTLE.questionsPerBattle,
          weakIds,
        }),
      )
    })
    return () => {
      active = false
    }
  }, [config, weakIds])

  if (!questions) {
    return (
      <main className="page page--center">
        <p className="muted">問題を準備中…</p>
      </main>
    )
  }
  if (questions.length === 0) {
    return (
      <main className="page page--center">
        <p>出題できる問題がありません</p>
        <Button onClick={onQuit}>ホームへ戻る</Button>
      </main>
    )
  }
  return <BattleRunner questions={questions} onFinish={onFinish} onQuit={onQuit} />
}

function BattleRunner({
  questions,
  onFinish,
  onQuit,
}: {
  questions: BattleQuestion[]
  onFinish: (state: BattleState) => void
  onQuit: () => void
}) {
  const [state, dispatch] = useReducer(battleReducer, questions, createBattleState)
  const reported = useRef(false)
  const current = state.questions[state.index]
  const answer = state.phase === 'feedback' ? lastAnswer(state) : undefined

  const onExpire = useCallback(() => dispatch({ type: 'timeout', elapsedMs: BATTLE.timePerQuestionMs }), [])
  const { remainingMs, getElapsedMs } = useCountdown(
    BATTLE.timePerQuestionMs,
    state.phase === 'answering',
    state.index,
    onExpire,
  )

  // 正解なら自動で次へ。不正解は解説を読んでから「次へ」を押してもらう
  useEffect(() => {
    if (answer?.correct) {
      const t = setTimeout(() => dispatch({ type: 'next' }), BATTLE.feedbackMs)
      return () => clearTimeout(t)
    }
  }, [answer])

  useEffect(() => {
    if (state.phase === 'finished' && !reported.current) {
      reported.current = true
      onFinish(state)
    }
  }, [state, onFinish])

  const choiceState = (i: number): ChoiceState => {
    if (!answer) return 'idle'
    if (i === current.answerIndex) return 'correct'
    if (i === answer.selectedIndex) return 'wrong'
    return 'dim'
  }

  const quit = () => {
    if (window.confirm('バトルをやめてホームに戻りますか？（記録は残りません）')) onQuit()
  }

  return (
    <main className="page battle">
      <TopBar
        onBack={quit}
        title={
          <span className="battle__count">
            {state.index + 1} / {state.questions.length}
          </span>
        }
        right={<Lives lives={state.lives} max={BATTLE.maxLives} />}
      />
      <ProgressBar value={state.index + (answer ? 1 : 0)} max={state.questions.length} height={6} />
      <TimerBar remainingMs={remainingMs} totalMs={BATTLE.timePerQuestionMs} />

      <Card className="battle__question">
        <span className="battle__category">{CATEGORY_LABELS[current.source.category]}</span>
        <p className="battle__prompt">{current.source.prompt}</p>
      </Card>

      <div className="battle__choices">
        {current.choices.map((choice, i) => (
          <ChoiceButton
            key={`${state.index}-${i}`}
            index={i}
            label={choice}
            state={choiceState(i)}
            disabled={state.phase !== 'answering'}
            onSelect={(choiceIndex) =>
              dispatch({ type: 'answer', choiceIndex, elapsedMs: getElapsedMs() })
            }
          />
        ))}
      </div>

      {answer && (
        <div className={answer.correct ? 'feedback feedback--correct' : 'feedback feedback--wrong'}>
          <p className="feedback__title">
            {answer.correct ? '⭕ 正解！' : answer.selectedIndex === null ? '⏰ 時間切れ！' : '❌ ざんねん…'}
          </p>
          {!answer.correct && (
            <>
              <p className="feedback__text">
                正解：<strong>{current.choices[current.answerIndex]}</strong>
                <br />
                {current.source.explanation}
              </p>
              <Button block onClick={() => dispatch({ type: 'next' })}>
                {state.lives <= 0 ? '結果を見る' : '次へ'}
              </Button>
            </>
          )}
        </div>
      )}
    </main>
  )
}
