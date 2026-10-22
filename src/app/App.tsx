import { useState } from 'react'
import { BattlePage } from '../pages/BattlePage'
import { HomePage } from '../pages/HomePage'
import type { Screen } from '../types/screen'
import { ProgressProvider } from './ProgressProvider'

/**
 * アプリのルート。画面遷移は state で管理する。
 * （画面数が少なく、Capacitor でも URL に依存しないため、ルーターは使わない）
 */
export function App() {
  const [screen, setScreen] = useState<Screen>({ name: 'home' })
  const goHome = () => setScreen({ name: 'home' })

  return (
    <ProgressProvider>
      <div className="app-shell">
        {screen.name === 'home' && (
          <HomePage
            onStartBattle={(config) => setScreen({ name: 'battle', config })}
            onOpenStats={() => setScreen({ name: 'stats' })}
          />
        )}
        {screen.name === 'battle' && (
          <BattlePage config={screen.config} onFinish={goHome} onQuit={goHome} />
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
