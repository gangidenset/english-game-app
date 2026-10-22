# ストア公開準備（Phase 16）

Google Play と App Store に公開するための手順とチェックリストです。
掲載文・スクリーンショットは [store/listing.md](../store/listing.md) にあります。

## 0. 公開前に決めること

| 項目 | 現在の値 | 場所 |
| --- | --- | --- |
| アプリ ID（パッケージ名 / Bundle ID） | `io.github.gangidenset.englishbattle` | `capacitor.config.ts`、`android/app/build.gradle`、Xcode |
| アプリ名 | 英語バトル | `capacitor.config.ts` |
| バージョン | 1.0.0 | `package.json`、`android/app/build.gradle`（versionName）、Xcode（MARKETING_VERSION） |

> **アプリ ID は公開後に変更できません。** 独自ドメインを持っている場合は
> `com.<ドメイン>.englishbattle` のような ID に変えてから公開してください。
> 変える場合は `capacitor.config.ts` の `appId` を変更し、`android/` と `ios/` を削除して
> `npx cap add android` / `npx cap add ios` / `npm run generate:native-assets` をやり直すのが確実です。

### バージョンを上げるとき

1. `package.json` の `version`（例：1.0.0 → 1.1.0）
2. `android/app/build.gradle` の `versionName` と **`versionCode`（毎回 +1 必須）**
3. Xcode の Version（MARKETING_VERSION）と **Build（CURRENT_PROJECT_VERSION、毎回 +1）**

## 1. 共通の準備

- [ ] 実機確認（[DEVICE_TEST.md](DEVICE_TEST.md)）がすべて OK
- [ ] プライバシーポリシーが GitHub Pages で公開されている（`/privacy.html`）
- [ ] 問題データの誤り・誤字の最終チェック（`npm test` も通ること）
- [ ] アイコン・スプラッシュの最終デザイン（`public/icons/icon-source.svg` を差し替え →
      `npm run generate:icons` と `npm run generate:native-assets`）

## 2. Google Play（Android）

### 必要なもの

- Google Play Console の開発者アカウント（登録料が必要。個人アカウントは公開前に
  一定人数・一定期間のクローズドテストが求められる場合があります）
- Android Studio

### ビルド

```bash
npm run cap:android      # ビルド → 同期 → Android Studio が開く
```

Android Studio で **Build → Generate Signed App Bundle / APK → Android App Bundle** を選び、
アップロード鍵（keystore）を作成して署名付きの `.aab` を作ります。

> keystore ファイルとパスワードは**絶対にリポジトリに入れない**でください（なくすと更新できなくなるので安全な場所に保管）。
> Play App Signing（Google が署名鍵を管理）を有効にするのがおすすめです。

### Play Console で入力する内容

- [ ] ストアの掲載情報（`store/listing.md`）、アイコン 512×512（`public/icons/pwa-512x512.png`）、
      フィーチャーグラフィック 1024×500、スクリーンショット
- [ ] **アプリのコンテンツ**
  - プライバシーポリシー URL
  - 広告：含まない
  - **データ セーフティ**：「データを収集しない」「データを共有しない」
    （学習データは端末内のみで、外部送信しないため）
  - **ターゲット ユーザー**：13〜15 歳（中学生）。
    13 歳未満を含める場合は「ファミリー向けポリシー」の要件を満たす必要があります
  - コンテンツのレーティング（IARC アンケート）：暴力・課金・ユーザー間交流なし
- [ ] 内部テスト → クローズドテスト → 製品版の順にリリース

## 3. App Store（iOS）

### 必要なもの

- Mac と Xcode
- Apple Developer Program（年会費が必要）

### ビルド

```bash
npm run cap:ios          # ビルド → 同期 → Xcode が開く
```

Xcode で：

1. **Signing & Capabilities** で Team（開発者アカウント）を選ぶ
2. 実機を接続して ▶ で動作確認
3. **Product → Archive** → **Distribute App** → App Store Connect にアップロード

### App Store Connect で入力する内容

- [ ] App 情報：名前・サブタイトル・カテゴリ（教育）
- [ ] **App のプライバシー**：「データの収集なし」
- [ ] 年齢制限指定（アンケート）：該当する項目なし → 4+ 相当
- [ ] スクリーンショット（6.7 インチ iPhone、12.9 インチ iPad）
- [ ] プライバシーポリシー URL、サポート URL
- [ ] TestFlight でテスト → 審査へ提出

### 審査で指摘されやすい点

- **ガイドライン 4.2（最低限の機能）**：Web サイトをそのまま包んだだけのアプリは却下されやすい。
  本アプリはオフライン動作・ネイティブの触覚フィードバック・端末内保存に対応済み。
  さらに通知（毎日の学習リマインダー）などのネイティブ機能を追加すると通りやすくなる。
- 外部リンク：プライバシーポリシー以外に外部サイトへ誘導しない。

## 4. 公開後

- ストアのレビュー・Issues で不具合や要望を集める
- 問題数を増やす（`src/data/*.json` に追加 → `npm test` → バージョンを上げて再提出）
- Web 版（GitHub Pages）は main に push するだけで自動更新される
