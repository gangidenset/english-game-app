import { withFallback } from './fallbackAdapter'
import { indexedDbAdapter, isIndexedDbAvailable } from './indexedDbAdapter'
import { localStorageAdapter } from './localStorageAdapter'
import type { StorageAdapter } from './StorageAdapter'

export type { StorageAdapter }

/**
 * アプリが使う保存先。切り替える場合はここだけを変更する。
 * 例：Firebase / Supabase に移行するときは、同じ StorageAdapter を実装したクラスを作り、
 *     ここで差し替える（画面・ゲームロジック側は変更不要）。
 */
export const storage: StorageAdapter = isIndexedDbAvailable()
  ? withFallback(indexedDbAdapter, localStorageAdapter)
  : localStorageAdapter
