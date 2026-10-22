# 効果音

現在の効果音は `src/services/feedbackService.ts` で Web Audio API により合成しています（音声ファイル不要）。
本格的な効果音を使う場合は、このフォルダに mp3 / ogg を置き、`feedbackService.ts` の再生処理を差し替えてください。
PWA のキャッシュ対象にするには `vite.config.ts` の `globPatterns` に拡張子を追加します。
