# 問題データ

問題はコードから分離し、このフォルダの JSON ファイルで管理します。
型定義は `src/types/question.ts` の `Question` です。

| ファイル | 内容 |
| --- | --- |
| `vocabulary.json` | 英単語（意味・品詞・スペル） |
| `grammar.json` | 英文法（時制・比較・関係代名詞など） |
| `phrases.json` | 熟語・会話表現 |

現在の問題数：単語 43 問 / 文法 41 問 / 熟語・会話 21 問（計 105 問）

## 1 問のフォーマット

```json
{
  "id": "voc-0001",
  "category": "vocabulary",
  "difficulty": 1,
  "prompt": "「図書館」を英語で言うと？",
  "choices": ["library", "hospital", "station", "museum"],
  "answerIndex": 0,
  "explanation": "library = 図書館。hospital は病院、station は駅、museum は博物館。",
  "tags": ["名詞", "中1"]
}
```

- `choices` の並び順は自由です（出題時に毎回シャッフルされます）。
- 会話文の改行は `\n` で書けます。

## 問題を追加したら

```bash
npm test
```

`src/__tests__/questions.data.test.ts` が、ID の重複・選択肢が 4 つあるか・
正解インデックスの範囲・空欄がないかなどを自動でチェックします。

新しいカテゴリのファイル（例：`listening.json`）を追加する場合は、
`src/types/question.ts` の `QuestionCategory` にも追加してください。
`src/data/` 直下の JSON は自動で読み込まれます。

## 問題数を増やすときのルール

- `id` は全ファイルで一意にする（`voc-` / `gra-` / `phr-` + 連番4桁）。
  学習履歴や苦手問題の記録は `id` で紐づくため、**一度公開した ID は変更・再利用しない**。
- 問題数が数千問規模になったら、カテゴリ・単元ごとにファイルを分割し、
  必要な分だけ動的 import（遅延読み込み）する構成に移行する。
