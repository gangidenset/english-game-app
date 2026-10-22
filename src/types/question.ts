/**
 * 問題データの型定義。
 * 問題本体は src/data/*.json に置き、コードとは分離する（src/data/README.md 参照）。
 */
export type QuestionCategory = 'vocabulary' | 'grammar' | 'phrases'

/** 1（易）〜 5（難）。高校入試の基礎〜応用を想定。 */
export type Difficulty = 1 | 2 | 3 | 4 | 5

export interface Question {
  /** 全問題で一意な ID（例: "voc-0001"）。学習履歴・苦手問題の記録に使う。 */
  id: string
  category: QuestionCategory
  difficulty: Difficulty
  /** 問題文 */
  prompt: string
  /** 4 つの選択肢 */
  choices: [string, string, string, string]
  /** 正解の選択肢のインデックス（0〜3） */
  answerIndex: 0 | 1 | 2 | 3
  /** 復習画面に表示する解説 */
  explanation: string
  /** 単元・テーマなどの自由タグ（例: ["過去形", "中2"]） */
  tags?: string[]
}
