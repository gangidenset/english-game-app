import { defineConfig, minimal2023Preset } from '@vite-pwa/assets-generator/config'

/**
 * PWA 用アイコンの生成設定。
 * public/icons/icon-source.svg を編集したら `npm run generate:icons` で public/icons/ に再生成する。
 */
export default defineConfig({
  headLinkOptions: { preset: '2023' },
  preset: {
    ...minimal2023Preset,
    // 元画像が全面塗りで中央に収まっているので、余白なしでそのまま使う
    maskable: { ...minimal2023Preset.maskable, padding: 0 },
    apple: { ...minimal2023Preset.apple, padding: 0 },
  },
  images: ['public/icons/icon-source.svg'],
})
