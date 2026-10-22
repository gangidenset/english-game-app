# 問題データ

問題はコードから分離し、このフォルダの JSON ファイルで管理します。
型定義は `src/types/question.ts` の `Question` です。

| ファイル | 内容 |
| --- | --- |
| `vocabulary.json` | 英単語（意味・品詞・スペル） |
| `grammar.json` | 英文法（時制・比較・関係代名詞など） |
| `phrases.json` | 熟語・会話表現 |

（Phase 5 で作成します）

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

## 問題数を増やすときのルール

- `id` は全ファイルで一意にする（`voc-` / `gra-` / `phr-` + 連番4桁）。
  学習履歴や苦手問題の記録は `id` で紐づくため、**一度公開した ID は変更・再利用しない**。
- 問題数が数千問規模になったら、カテゴリ・単元ごとにファイルを分割し、
  必要な分だけ動的 import（遅延読み込み）する構成に移行する。
