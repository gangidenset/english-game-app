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
| 2 | スマホ向けUI | デザイントークン、共通コンポーネント（ボタン・カード・ゲージ） | ✅ 完了 |
| 3 | ホーム画面 | レベル / XP / 連続学習日数 / 今日のミッション / バトル開始 | ✅ 完了 |
| 4 | 英語バトル | 4択問題の出題・回答判定 | ✅ 完了 |
| 5 | 問題データ | `src/data/*.json`（まず100問）、読み込みサービス | ✅ 完了 |
| 6 | タイマー・ライフ | 制限時間、ライフ制、ゲームオーバー | ✅ 完了 |
| 7 | スコア・コンボ | 得点計算、コンボ倍率 | ✅ 完了 |
| 8 | 結果画面 | 正解数 / 正答率 / スコア / 最大コンボ / ランク / 獲得XP | ✅ 完了 |
| 9 | 復習機能 | 間違えた問題・正解・解説・再挑戦 | ✅ 完了 |
| 10 | 学習履歴 | XP・レベル・連続日数・苦手問題の保存（StorageAdapter） | ✅ 完了 |
| 11 | PWA | manifest、Service Worker、アイコン、オフライン対応 | ✅ 完了 |
| 12 | GitHub Pages | GitHub Actions による自動デプロイ | ✅ 完了 |
| 13 | スマートフォン実機確認 | 端末サイズ別の自動確認・修正、実機チェックリスト（[DEVICE_TEST.md](DEVICE_TEST.md)） | ✅ 自動確認済み・実機は要確認 |
| 14 | Capacitor | `@capacitor/core` 導入、`capacitor.config.ts` | ✅ 完了 |
| 15 | Android / iOS 対応 | ネイティブプロジェクト生成、アイコン・スプラッシュ | ✅ 生成済み・実機ビルドは要確認 |
| 16 | ストア公開準備 | 掲載文・スクリーンショット・プライバシーポリシー・公開手順（[STORE_RELEASE.md](STORE_RELEASE.md)） | ✅ 準備完了・申請は手動 |

## MVP 後の開発予定

- 問題数の拡充（下記）とリスニング問題
- 毎日の学習リマインダー通知（@capacitor/local-notifications）
- 学年・単元別モード、入試直前の模試モード
- 苦手問題を優先する間隔反復アルゴリズム
- クラウド保存（Firebase / Supabase）と端末間同期
- ランキング・実績バッジ

## 問題数の拡張計画

100問 → 500問 → 1000問 → 3000問。
ID 規則と分割方針は `src/data/README.md` を参照。

## 保存先の拡張計画

localStorage → IndexedDB → Firebase / Supabase（アカウント・端末間同期）。
すべて `src/services/storage/StorageAdapter.ts` の実装差し替えで対応する。
