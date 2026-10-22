import { isNativeApp } from '../../platform/native'
import { withFallback } from './fallbackAdapter'
import { indexedDbAdapter, isIndexedDbAvailable } from './indexedDbAdapter'
import { localStorageAdapter } from './localStorageAdapter'
import { preferencesAdapter } from './preferencesAdapter'
import type { StorageAdapter } from './StorageAdapter'

export type { StorageAdapter }

function selectStorage(): StorageAdapter {
  // Android / iOS アプリ：ネイティブの保存領域
  if (isNativeApp) return preferencesAdapter
  // Web / PWA：IndexedDB（使えなければ localStorage）
  return isIndexedDbAvailable() ? withFallback(indexedDbAdapter, localStorageAdapter) : localStorageAdapter
}

/**
 * アプリが使う保存先。切り替える場合はここだけを変更する。
 * 例：Firebase / Supabase に移行するときは、同じ StorageAdapter を実装したものを作り、
 *     ここで差し替える（画面・ゲームロジック側は変更不要）。
 */
export const storage: StorageAdapter = selectStorage()
