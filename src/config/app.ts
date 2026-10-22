/** アプリ全体で共有する設定値。 */
export const APP_CONFIG = {
  name: '英語バトル',
  /** package.json の version（vite.config.ts でビルド時に埋め込む） */
  version: __APP_VERSION__,
  /** 保存データのキーの先頭につける名前空間（他アプリとの衝突防止）。 */
  storageNamespace: 'english-game-app',
  /** 公開版の URL（GitHub Pages） */
  webUrl: 'https://gangidenset.github.io/english-game-app/',
  /** プライバシーポリシー（ストア審査でも使う公開 URL） */
  privacyPolicyUrl: 'https://gangidenset.github.io/english-game-app/privacy.html',
} as const
