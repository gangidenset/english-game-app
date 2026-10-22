# 英語バトル（english-game-app）

中学生がスマートフォンで毎日遊べる、**高校入試対策の英語学習ゲーム**です。

> 単なる英単語帳ではなく、**ゲーム性 × 学習 × 成長実感 × 高校入試対策** を組み合わせます。

現在のステータス：**v1.0.0 — Phase 1〜16 実装済み**（Web 版・PWA・Android / iOS プロジェクト・ストア公開準備）。
実機での最終確認とストアへの申請は手作業で行います（[docs/STORE_RELEASE.md](docs/STORE_RELEASE.md)）。
全体の計画は [docs/ROADMAP.md](docs/ROADMAP.md) を参照してください。

---

## 1. アプリ概要

| 画面 | 内容 |
| --- | --- |
| HOME | プレイヤーレベル・XP・連続学習日数・今日のミッション・バトル開始 |
| BATTLE | 英単語・英文法の4択問題、制限時間、ライフ、スコア、コンボ |
| RESULT | 正解数・正答率・スコア・最大コンボ・ランク・獲得XP |
| REVIEW | 間違えた問題・正解・解説・再挑戦 |
| 学習記録 | 累計成績・分野別正答率・苦手問題・最近のバトル・設定 |

### ゲームのルール

| 項目 | 内容 | 設定場所 |
| --- | --- | --- |
| 1 バトル | 10 問・4 択 | `src/config/game.ts` |
| 制限時間 | 1 問 15 秒（アプリを離れている間は止まる） | 同上 |
| ライフ | 3（不正解・時間切れで -1、0 でゲームオーバー） | 同上 |
| スコア | (100 + 残り秒数 × 10) × コンボ倍率（1 コンボごとに +10%、最大 2 倍） | 同上 |
| ランク | 正答率 90% 以上 S / 80% A / 60% B / 40% C / それ未満 D（ゲームオーバー時は最高 C） | 同上 |
| XP | 正解 × 10 + スコア ÷ 100 + クリア 20 + パーフェクト 30 + ミッション報酬 | 同上 |
| レベル | Lv.n → n+1 に 100 + (n-1) × 50 XP。レベルに応じて称号が変わる | 同上 |
| 今日のミッション | 毎日 3 つ（日付で自動選出）。達成で XP ボーナス | `src/config/missions.ts` |
| 苦手問題 | 間違えると登録、2 回続けて正解すると解除。通常バトルに 3 割混ざる | `src/config/game.ts` |

バトルのモード：ミックス / 単語 / 文法 / 熟語・会話 / 苦手克服 / 復習からの再挑戦

## 2. コンセプト

- **毎日5分**：1回のバトルは短く、通学時間や寝る前に遊べる長さ。
- **成長実感**：XP・レベル・連続学習日数で「続けるほど強くなる」を見える化。
- **入試対策**：中1〜中3の必修単語・文法を、高校入試の出題形式に合わせて出題。
- **苦手克服**：間違えた問題を記録し、復習・再挑戦で定着させる。
- **スマホ最優先**：最初からスマホアプリとして設計し、タブレット・PC にも対応。

## 3. 使用技術と選定理由

| 技術 | 用途 | 選んだ理由 |
| --- | --- | --- |
| **React** | UI | 画面を部品（コンポーネント）単位で作れ、情報・ライブラリが最も豊富。Capacitor と組み合わせてそのままスマホアプリにできる。 |
| **TypeScript** | 言語 | 問題データ・学習データの型を定義でき、問題数や機能が増えてもバグを防ぎやすい。 |
| **Vite** | ビルド | 起動・ビルドが高速。静的ファイルを出力するので GitHub Pages と Capacitor の両方にそのまま使える。 |
| **vite-plugin-pwa** | PWA | manifest と Service Worker を自動生成し、オフライン対応・ホーム画面追加を少ない設定で実現できる。 |
| **Capacitor** | ネイティブ化 | 同じ Web コードを Android / iOS アプリとしてビルドし、Google Play / App Store に公開できる。React Native と違い Web 版と完全に同じコードで済む。 |
| **GitHub Actions + Pages** | 公開 | 無料で、`main` へ push するだけで自動ビルド・公開できる。 |
| **IndexedDB / localStorage / Capacitor Preferences** | 保存 | サーバー不要で端末内に学習データを保存（Web は IndexedDB、使えなければ localStorage、アプリ版はネイティブ保存領域）。保存処理はインターフェースで抽象化し、将来 Firebase / Supabase へ移行できる。 |
| **Vitest** | テスト | Vite と同じ設定で動く高速なテストツール。ゲームロジックと問題データの形式を自動チェック。 |
| **Web Audio API** | 効果音 | 音声ファイルなしで効果音を合成。容量ゼロでオフラインでも鳴る。 |
| **oxlint** | Lint | Vite 公式テンプレートが採用している高速な Lint ツール。 |

> ルーター（react-router 等）は使わず、画面遷移は React の state で管理しています。
> 画面数が少なく、Capacitor アプリ内では URL に依存しない方がシンプルなためです。

## 4. フォルダ構成

```
english-game-app/
├── .github/workflows/deploy.yml  # GitHub Actions（テスト → ビルド → GitHub Pages）
├── public/                 # そのまま配信される静的ファイル
│   ├── icons/              # アプリアイコン（icon-source.svg が元画像）
│   ├── sounds/             # 効果音ファイル置き場（現在は合成音のため空）
│   └── privacy.html        # プライバシーポリシー
├── src/
│   ├── app/                # アプリのルート・画面遷移・学習データの Provider
│   ├── pages/              # 画面（Home / Battle / Result / Review / Stats）
│   ├── components/         # 再利用する UI 部品（Button, Card, TimerBar, Lives ...）
│   ├── game/               # ゲームのルール（進行 reducer・スコア・ランク・XP）※画面から独立
│   ├── hooks/              # React カスタムフック（タイマー）
│   ├── data/               # 問題データ（JSON）※コードと分離
│   ├── services/           # 問題の出題・学習データ・ミッション・効果音
│   │   └── storage/        # 保存処理の抽象化（IndexedDB / localStorage / Preferences）
│   ├── platform/           # Web / Android / iOS の違いを吸収する処理
│   ├── pwa/                # Service Worker の登録・更新通知
│   ├── config/             # ゲームバランス・ミッションなどの設定値
│   ├── types/              # 型定義
│   ├── utils/              # 汎用関数（日付・乱数・レベル計算）
│   ├── styles/             # CSS（デザイントークン・部品・画面）
│   ├── __tests__/          # 単体テスト・問題データの検証
│   └── main.tsx            # エントリーポイント
├── android/                # Android アプリ（Capacitor が生成、Android Studio で開く）
├── ios/                    # iOS アプリ（Capacitor が生成、Xcode で開く）
├── assets/                 # ネイティブアプリ用アイコン・スプラッシュの元画像
├── scripts/                # 補助スクリプト（アイコン生成など）
├── store/                  # ストア掲載文・スクリーンショット
├── docs/                   # ロードマップ・実機確認・ストア公開手順
├── capacitor.config.ts     # Capacitor 設定（アプリ ID・名前）
├── pwa-assets.config.ts    # PWA アイコン生成設定
├── vite.config.ts          # Vite・PWA 設定
└── package.json
```

## 5. 開発環境

- **Node.js 20.19 以上**（推奨：22。`.nvmrc` あり）
- npm 10 以上
- エディタ：VS Code 推奨
- Android アプリ化：Android Studio
- iOS アプリ化：macOS + Xcode

バージョン確認：

```bash
node -v
npm -v
```

## 6. ローカル起動方法

```bash
# 1. リポジトリを取得
git clone https://github.com/gangidenset/english-game-app.git
cd english-game-app

# 2. 依存パッケージをインストール
npm install

# 3. 開発サーバーを起動
npm run dev
```

ターミナルに表示される `http://localhost:5173/` をブラウザで開きます。

**スマホで確認する場合**：PC とスマホを同じ Wi-Fi に接続し、
ターミナルに表示される `Network: http://192.168.x.x:5173/` をスマホのブラウザで開きます。

| コマンド | 内容 |
| --- | --- |
| `npm run dev` | 開発サーバー起動（同じ Wi-Fi のスマホからもアクセス可） |
| `npm run build` | 型チェック + 本番ビルド（`dist/` に出力） |
| `npm run preview` | ビルド結果をローカルで確認 |
| `npm run lint` | Lint |
| `npm run typecheck` | 型チェックのみ |
| `npm test` | テスト（ゲームロジック・問題データの検証） |
| `npm run generate:icons` | PWA 用アイコンを再生成 |
| `npm run generate:native-assets` | Android / iOS 用アイコン・スプラッシュを再生成 |
| `npm run cap:android` | ビルドして Android Studio で開く |
| `npm run cap:ios` | ビルドして Xcode で開く（Mac のみ） |

### 問題を追加するには

`src/data/vocabulary.json`（単語）・`grammar.json`（文法）・`phrases.json`（熟語・会話）に追加し、
`npm test` で形式をチェックします。詳しくは [src/data/README.md](src/data/README.md)。

## 7. GitHub Pages 公開方法

`main` ブランチへ push すると GitHub Actions（`.github/workflows/deploy.yml`）が自動でテスト・ビルドし、GitHub Pages に公開します。

```
main へ push → GitHub Actions → npm ci → lint → test → build → GitHub Pages
```

初回のみ必要な設定：

1. GitHub のリポジトリページ → **Settings** → **Pages**
2. **Build and deployment** の **Source** を **GitHub Actions** に変更
3. 開発ブランチを `main` にマージ（プルリクエストを作ってマージ）する
4. GitHub の **Actions** タブで「Build & Deploy to GitHub Pages」が緑色になれば、
   `https://gangidenset.github.io/english-game-app/` で公開されます

`vite.config.ts` で `base: './'`（相対パス）にしているため、
リポジトリ名のサブパスでも Capacitor アプリ内でも、同じビルドが動作します。

## 8. PWA 化

`vite-plugin-pwa` がビルド時に次のものを自動生成します（設定は `vite.config.ts`）。

- `manifest.webmanifest`（アプリ名・アイコン・テーマカラー・`display: standalone`・縦向き）
- Service Worker `sw.js`（画面・問題データ・アイコンをすべてキャッシュし、オフラインでも遊べる）
- 各サイズのアイコン（64 / 192 / 512px・maskable・Apple Touch Icon・favicon）は `public/icons/` に生成済み

新しいバージョンを公開すると、ホーム画面に「新しいバージョンがあります［更新］」と表示されます
（バトル中に勝手に再読み込みしないよう、ホーム画面でだけ表示）。

スマホでの「ホーム画面に追加」：

- **iPhone（Safari）**：共有ボタン → 「ホーム画面に追加」
- **Android（Chrome）**：メニュー → 「アプリをインストール」または「ホーム画面に追加」

追加したアイコンから起動すると、アドレスバーのないアプリ画面で起動します。

## 9. Android アプリ化

Capacitor の導入と Android プロジェクト（`android/`）の生成は済んでいます。
必要なのは [Android Studio](https://developer.android.com/studio) だけです。

```bash
npm install
npm run cap:android   # Web をビルド → android/ に反映 → Android Studio が開く
```

Android Studio で実機（USB デバッグを ON）またはエミュレーターを選び、▶ で起動します。
Web 側のコードを変更したら、もう一度 `npm run cap:android`（または `npm run cap:sync`）を実行します。

アプリ版だけの動き：

- 学習データはネイティブの保存領域（Capacitor Preferences）に保存
- 振動は Haptics プラグイン（iPhone でも振動）
- Android の戻るボタンで前の画面に戻る（ホームではアプリを閉じる）
- Service Worker は使わない（更新はストア経由）

Google Play 公開：Android Studio で署名付き App Bundle（`.aab`）を作成 →
Google Play Console に登録（開発者登録料が必要）→ テスト → 本番公開。
詳しい手順とチェックリストは [docs/STORE_RELEASE.md](docs/STORE_RELEASE.md)。

> アプリ ID は `io.github.gangidenset.englishbattle` です。公開後は変更できないので、
> 変更する場合は公開前に行ってください（手順は STORE_RELEASE.md）。

## 10. iOS アプリ化

iOS プロジェクト（`ios/`、Swift Package Manager 方式）は生成済みです。macOS と Xcode が必要です。

```bash
npm install
npm run cap:ios   # Web をビルド → ios/ に反映 → Xcode が開く
```

Xcode の **Signing & Capabilities** で Team を選び、実機またはシミュレーターで ▶ を押します。

App Store 公開：Apple Developer Program に登録（年会費が必要）→ Xcode で Archive →
App Store Connect にアップロード → TestFlight でテスト → 審査に提出。
詳しくは [docs/STORE_RELEASE.md](docs/STORE_RELEASE.md)。

## 11. 今後の開発予定

- 実機での最終確認（[docs/DEVICE_TEST.md](docs/DEVICE_TEST.md)）→ ユーザーテスト → 改善
- Google Play / App Store への申請（[docs/STORE_RELEASE.md](docs/STORE_RELEASE.md)）
- 問題数の拡充（105 → 500 → 1000 → 3000問）
- 毎日の学習リマインダー通知
- リスニング問題（音声）
- 学年・単元別モード、入試直前の模試モード
- 苦手問題を優先して出題する仕組み（間隔反復）
- クラウド保存（Firebase / Supabase）と端末間同期
- ランキング・実績バッジ

詳細は [docs/ROADMAP.md](docs/ROADMAP.md) を参照。

## 12. コミットメッセージ規約

```
feat: 新機能        fix: バグ修正          docs: ドキュメント
style: 見た目のみ   refactor: リファクタ    chore: 設定・依存関係
```
