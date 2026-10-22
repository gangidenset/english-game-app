/**
 * データ保存処理の抽象インターフェース。
 *
 * アプリ本体はこのインターフェースだけに依存する。
 * 保存先を localStorage → IndexedDB → Firebase / Supabase と切り替えても、
 * 実装クラスを差し替えるだけで画面側のコードは変更不要にするのが目的。
 * 将来のクラウド保存を見越して、すべて Promise を返す非同期 API にしている。
 */
export interface StorageAdapter {
  get<T>(key: string): Promise<T | null>
  set<T>(key: string, value: T): Promise<void>
  remove(key: string): Promise<void>
}
