import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// base を相対パス './' にすることで、同じビルド成果物を
//   - GitHub Pages（https://<user>.github.io/english-game-app/）
//   - Capacitor（Android / iOS アプリ内の file 相当パス）
// のどちらでもそのまま動かせるようにしている。
// https://vite.dev/config/
export default defineConfig({
  base: './',
  plugins: [react()],
})
