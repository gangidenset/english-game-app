import { APP_CONFIG } from '../config/app'

/** HOME 画面（Phase 1 時点ではプレースホルダー。Phase 3 で本実装）。 */
export function HomePage() {
  return (
    <main className="page">
      <h1 className="page-title">{APP_CONFIG.name}</h1>
      <p className="page-lead">高校入試に向けて、毎日5分の英語バトル！</p>
      <p className="page-note">v{APP_CONFIG.version} ・ 開発中</p>
    </main>
  )
}
