import type { CapacitorConfig } from '@capacitor/cli'

/**
 * Capacitor（Android / iOS アプリ化）の設定。
 * `npm run build` で作った dist/ をネイティブアプリに組み込む。
 *
 * appId はストアでアプリを識別する ID。一度ストアに公開すると変更できないので、
 * 公開前に最終決定すること（docs/STORE_RELEASE.md 参照）。
 */
const config: CapacitorConfig = {
  appId: 'io.github.gangidenset.englishbattle',
  appName: '英語バトル',
  webDir: 'dist',
  backgroundColor: '#0f0d2e',
  android: {
    // 本番ビルドで WebView のデバッグを無効にする
    webContentsDebuggingEnabled: false,
  },
  ios: {
    contentInset: 'never',
  },
}

export default config
