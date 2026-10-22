import { useEffect, useState } from 'react'
import { BattlePage } from '../pages/BattlePage'
import { HomePage } from '../pages/HomePage'
import { ResultPage } from '../pages/ResultPage'
import { ReviewPage } from '../pages/ReviewPage'
import { StatsPage } from '../pages/StatsPage'
import type { BattleConfig } from '../types/battle'
import type { Screen } from '../types/screen'
import { useProgress } from './ProgressContext'
import { ProgressProvider } from './ProgressProvider'

export function App() {
  return (
    <ProgressProvider>
      <div className="app-shell">
        <Screens />
      </div>
    </ProgressProvider>
  )
}

/**
 * 画面遷移は state で管理する。
 * （画面数が少なく、Capacitor でも URL に依存しないため、ルーターは使わない）
 */
function Screens() {
  const { commitBattle } = useProgress()
  const [screen, setScreen] = useState<Screen>({ name: 'home' })

  // 画面が切り替わったら先頭までスクロール
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [screen])

  const goHome = () => setScreen({ name: 'home' })
  // key を毎回変えて、同じ設定での「もう一度」でもバトルを作り直す
  const startBattle = (config: BattleConfig) => setScreen({ name: 'battle', config, key: Date.now() })

  switch (screen.name) {
    case 'home':
      return <HomePage onStartBattle={startBattle} onOpenStats={() => setScreen({ name: 'stats' })} />
    case 'battle':
      return (
        <BattlePage
          key={screen.key}
          config={screen.config}
          onFinish={(result) => setScreen({ name: 'result', result, outcome: commitBattle(result) })}
          onQuit={goHome}
        />
      )
    case 'result':
      return (
        <ResultPage
          result={screen.result}
          outcome={screen.outcome}
          onRetry={() => startBattle(screen.result.config)}
          onReview={() => setScreen({ ...screen, name: 'review' })}
          onHome={goHome}
        />
      )
    case 'review':
      return (
        <ReviewPage
          result={screen.result}
          onRetry={(questionIds) => startBattle({ mode: 'retry', questionIds })}
          onBack={() => setScreen({ ...screen, name: 'result' })}
        />
      )
    case 'stats':
      return <StatsPage onBack={goHome} />
  }
}
