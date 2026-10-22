import { useEffect, useState } from 'react'
import { BattlePage } from '../pages/BattlePage'
import { HomePage } from '../pages/HomePage'
import { ResultPage } from '../pages/ResultPage'
import { ReviewPage } from '../pages/ReviewPage'
import type { BattleConfig } from '../types/battle'
import type { Screen } from '../types/screen'
import { ProgressProvider } from './ProgressProvider'

/**
 * アプリのルート。画面遷移は state で管理する。
 * （画面数が少なく、Capacitor でも URL に依存しないため、ルーターは使わない）
 */
export function App() {
  const [screen, setScreen] = useState<Screen>({ name: 'home' })
  // 画面が切り替わったら先頭までスクロール
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [screen])

  const goHome = () => setScreen({ name: 'home' })
  // key を毎回変えて、同じ設定での「もう一度」でもバトルを作り直す
  const startBattle = (config: BattleConfig) => setScreen({ name: 'battle', config, key: Date.now() })

  return (
    <ProgressProvider>
      <div className="app-shell">
        {screen.name === 'home' && (
          <HomePage onStartBattle={startBattle} onOpenStats={() => setScreen({ name: 'stats' })} />
        )}
        {screen.name === 'battle' && (
          <BattlePage
            key={screen.key}
            config={screen.config}
            onFinish={(result) => setScreen({ name: 'result', result })}
            onQuit={goHome}
          />
        )}
        {screen.name === 'result' && (
          <ResultPage
            result={screen.result}
            onRetry={() => startBattle(screen.result.config)}
            onReview={() => setScreen({ name: 'review', result: screen.result })}
            onHome={goHome}
          />
        )}
        {screen.name === 'review' && (
          <ReviewPage
            result={screen.result}
            onRetry={(questionIds) => startBattle({ mode: 'retry', questionIds })}
            onBack={() => setScreen({ name: 'result', result: screen.result })}
          />
        )}
        {screen.name === 'stats' && (
          <main className="page page--center">
            <p>準備中です</p>
            <button onClick={goHome}>ホームへ</button>
          </main>
        )}
      </div>
    </ProgressProvider>
  )
}
