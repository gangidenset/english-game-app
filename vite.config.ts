import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

// base を相対パス './' にすることで、同じビルド成果物を
//   - GitHub Pages（https://<user>.github.io/english-game-app/）
//   - Capacitor（Android / iOS アプリ内）
// のどちらでもそのまま動かせるようにしている。
// https://vite.dev/config/
export default defineConfig({
  base: './',
  plugins: [
    react(),
    // PWA：manifest.webmanifest と Service Worker（sw.js）をビルド時に自動生成する
    VitePWA({
      // 新バージョンがあればホーム画面で「更新」ボタンを出す（バトル中に勝手に再読み込みしない）
      registerType: 'prompt',
      injectRegister: false,
      includeAssets: ['icons/favicon.ico', 'icons/apple-touch-icon-180x180.png', 'icons/icon.svg'],
      manifest: {
        id: './',
        name: '英語バトル - 高校入試対策',
        short_name: '英語バトル',
        description: '中学生のための高校入試対策 英語学習ゲーム。毎日5分の英語バトルで単語・文法・熟語を身につけよう。',
        lang: 'ja',
        start_url: './',
        scope: './',
        display: 'standalone',
        orientation: 'portrait',
        theme_color: '#1e1b4b',
        background_color: '#0f0d2e',
        categories: ['education', 'games'],
        icons: [
          { src: 'icons/pwa-64x64.png', sizes: '64x64', type: 'image/png' },
          { src: 'icons/pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icons/pwa-512x512.png', sizes: '512x512', type: 'image/png' },
          { src: 'icons/maskable-icon-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        // 画面・問題データ（JS チャンク）・アイコンをすべてキャッシュし、オフラインで遊べるようにする
        globPatterns: ['**/*.{js,css,html,ico,png,svg,webmanifest,mp3,ogg}'],
        cleanupOutdatedCaches: true,
      },
    }),
  ],
})
