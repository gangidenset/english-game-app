/** アプリ全体で共有する設定値。 */
export const APP_CONFIG = {
  name: '英語バトル',
  version: '0.1.0',
  /** 保存データのキーの先頭につける名前空間（他アプリとの衝突防止）。 */
  storageNamespace: 'english-game-app',
} as const
