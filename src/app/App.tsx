import { useState } from 'react'
import type { Screen } from '../types/screen'
import { HomePage } from '../pages/HomePage'

/**
 * アプリのルート。画面遷移は state で管理する。
 * （画面数が少なく、Capacitor でも URL に依存しないため、ルーターは使わない）
 */
export function App() {
  const [screen] = useState<Screen>('home')

  return <div className="app-shell">{screen === 'home' && <HomePage />}</div>
}
