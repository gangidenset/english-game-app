# 開発ロードマップ

```
空のGitHubリポジトリ → React + TypeScript + Vite → 英語学習ゲーム完成
→ GitHub Pages 公開 → スマホブラウザで使用 → PWA（ホーム画面に追加）
→ ユーザーテスト → 機能改善 → Capacitor 導入
→ Android アプリ化 → Google Play 公開 → iOS アプリ化 → App Store 公開
```

| Phase | 内容 | 主な成果物 | 状態 |
| --- | --- | --- | --- |
| 1 | プロジェクト初期構築 | Vite + React + TS、フォルダ構成、README | ✅ 完了 |
| 2 | スマホ向けUI | デザイントークン、共通コンポーネント（ボタン・カード・ゲージ） | ⬜ |
| 3 | ホーム画面 | レベル / XP / 連続学習日数 / 今日のミッション / バトル開始 | ⬜ |
| 4 | 英語バトル | 4択問題の出題・回答判定 | ⬜ |
| 5 | 問題データ | `src/data/*.json`（まず100問）、読み込みサービス | ⬜ |
| 6 | タイマー・ライフ | 制限時間、ライフ制、ゲームオーバー | ⬜ |
| 7 | スコア・コンボ | 得点計算、コンボ倍率 | ⬜ |
| 8 | 結果画面 | 正解数 / 正答率 / スコア / 最大コンボ / ランク / 獲得XP | ⬜ |
| 9 | 復習機能 | 間違えた問題・正解・解説・再挑戦 | ⬜ |
| 10 | 学習履歴 | XP・レベル・連続日数・苦手問題の保存（StorageAdapter） | ⬜ |
| 11 | PWA | manifest、Service Worker、アイコン、オフライン対応 | ⬜ |
| 12 | GitHub Pages | GitHub Actions による自動デプロイ | ⬜ |
| 13 | スマートフォン実機確認 | iPhone / Android / iPad での動作確認・修正 | ⬜ |
| 14 | Capacitor | `@capacitor/core` 導入、`capacitor.config.ts` | ⬜ |
| 15 | Android / iOS 対応 | ネイティブプロジェクト生成、実機ビルド | ⬜ |
| 16 | ストア公開準備 | アイコン・スクリーンショット・プライバシーポリシー・審査対応 | ⬜ |

## 問題数の拡張計画

100問 → 500問 → 1000問 → 3000問。
ID 規則と分割方針は `src/data/README.md` を参照。

## 保存先の拡張計画

localStorage → IndexedDB → Firebase / Supabase（アカウント・端末間同期）。
すべて `src/services/storage/StorageAdapter.ts` の実装差し替えで対応する。
