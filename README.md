# 英語バトル（english-game-app）

中学生がスマートフォンで毎日遊べる、**高校入試対策の英語学習ゲーム**です。

> 単なる英単語帳ではなく、**ゲーム性 × 学習 × 成長実感 × 高校入試対策** を組み合わせます。

現在のステータス：**Phase 1（プロジェクト初期構築）完了**。
全体の計画は [docs/ROADMAP.md](docs/ROADMAP.md) を参照してください。

---

## 1. アプリ概要

| 画面 | 内容 |
| --- | --- |
| HOME | プレイヤーレベル・XP・連続学習日数・今日のミッション・バトル開始 |
| BATTLE | 英単語・英文法の4択問題、制限時間、ライフ、スコア、コンボ |
| RESULT | 正解数・正答率・スコア・最大コンボ・ランク・獲得XP |
| REVIEW | 間違えた問題・正解・解説・再挑戦 |

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
| **vite-plugin-pwa**（Phase 11） | PWA | manifest と Service Worker を自動生成し、オフライン対応・ホーム画面追加を少ない設定で実現できる。 |
| **Capacitor**（Phase 14〜） | ネイティブ化 | 同じ Web コードを Android / iOS アプリとしてビルドし、Google Play / App Store に公開できる。React Native と違い Web 版と完全に同じコードで済む。 |
| **GitHub Actions + Pages**（Phase 12） | 公開 | 無料で、`main` へ push するだけで自動ビルド・公開できる。 |
| **localStorage → IndexedDB**（Phase 10） | 保存 | サーバー不要で端末内に学習データを保存。保存処理はインターフェースで抽象化し、将来 Firebase / Supabase へ移行できる。 |
| **oxlint** | Lint | Vite 公式テンプレートが採用している高速な Lint ツール。 |

> ルーター（react-router 等）は使わず、画面遷移は React の state で管理しています。
> 画面数が少なく、Capacitor アプリ内では URL に依存しない方がシンプルなためです。

## 4. フォルダ構成

```
english-game-app/
├── public/                 # そのまま配信される静的ファイル
│   ├── icons/              # アプリアイコン（PWA / ストア用）
│   └── sounds/             # 効果音（正解・不正解・コンボなど）
├── src/
│   ├── app/                # アプリのルート・画面遷移
│   ├── pages/              # 画面（Home / Battle / Result / Review）
│   ├── components/         # 再利用する UI 部品
│   ├── hooks/              # React カスタムフック（タイマー等）
│   ├── data/               # 問題データ（JSON）※コードと分離
│   ├── services/           # データ保存・問題読み込みなどのロジック
│   │   └── storage/        # 保存処理の抽象化（localStorage → IndexedDB → クラウド）
│   ├── types/              # 型定義（Question など）
│   ├── utils/              # 汎用関数（シャッフル・日付計算など）
│   ├── config/             # アプリ設定値
│   ├── styles/             # CSS
│   └── main.tsx            # エントリーポイント
├── docs/ROADMAP.md         # 開発ロードマップ
├── index.html
├── package.json
├── tsconfig*.json
└── vite.config.ts
```

## 5. 開発環境

- **Node.js 20.19 以上**（推奨：22。`.nvmrc` あり）
- npm 10 以上
- エディタ：VS Code 推奨
- Android アプリ化：Android Studio（Phase 15）
- iOS アプリ化：macOS + Xcode（Phase 15）

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

## 7. GitHub Pages 公開方法（Phase 12 で設定）

`main` ブランチへ push すると GitHub Actions が自動でビルドし、GitHub Pages に公開する構成にします。

```
main へ push → GitHub Actions → npm ci → npm run build → GitHub Pages
```

初回のみ必要な設定：

1. GitHub のリポジトリページ → **Settings** → **Pages**
2. **Build and deployment** の **Source** を **GitHub Actions** に変更
3. `main` に push すると `https://gangidenset.github.io/english-game-app/` で公開されます

`vite.config.ts` で `base: './'`（相対パス）にしているため、
リポジトリ名のサブパスでも Capacitor アプリ内でも、同じビルドが動作します。

## 8. PWA 化（Phase 11 で実装）

- `manifest.webmanifest`（アプリ名・アイコン・テーマカラー・`display: standalone`）
- Service Worker（画面と問題データをキャッシュし、オフラインでも遊べる）
- 各サイズのアイコン（192px / 512px / maskable / Apple Touch Icon）

スマホでの「ホーム画面に追加」：

- **iPhone（Safari）**：共有ボタン → 「ホーム画面に追加」
- **Android（Chrome）**：メニュー → 「アプリをインストール」または「ホーム画面に追加」

追加したアイコンから起動すると、アドレスバーのないアプリ画面で起動します。

## 9. Android アプリ化（Phase 14〜16）

```bash
# Capacitor を導入
npm install @capacitor/core
npm install -D @capacitor/cli
npx cap init "英語バトル" com.example.englishbattle --web-dir dist

# Android プロジェクトを追加
npm install @capacitor/android
npx cap add android

# Web をビルドしてネイティブへ反映
npm run build
npx cap sync android

# Android Studio で開いて実機 / エミュレーターで実行
npx cap open android
```

Google Play 公開：Android Studio で署名付き App Bundle（`.aab`）を作成 →
Google Play Console に登録（開発者登録料が必要）→ 内部テスト → 本番公開。

> アプリ ID（`com.example.englishbattle`）は公開後に変更できないため、Phase 14 で正式に決めます。

## 10. iOS アプリ化（Phase 14〜16）

macOS と Xcode が必要です。

```bash
npm install @capacitor/ios
npx cap add ios
npm run build
npx cap sync ios
npx cap open ios   # Xcode が開く
```

App Store 公開：Apple Developer Program に登録（年会費が必要）→ Xcode で Archive →
App Store Connect にアップロード → TestFlight でテスト → 審査に提出。

## 11. 今後の開発予定

- Phase 2〜10：ゲーム本体（UI・HOME・BATTLE・RESULT・REVIEW・学習履歴）
- Phase 11〜13：PWA・GitHub Pages・実機確認
- Phase 14〜16：Capacitor・Android / iOS・ストア公開準備
- その後の構想：
  - 問題数の拡充（100 → 500 → 1000 → 3000問）
  - リスニング問題（音声）・効果音
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
