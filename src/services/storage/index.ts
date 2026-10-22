import { localStorageAdapter } from './localStorageAdapter'
import type { StorageAdapter } from './StorageAdapter'

export type { StorageAdapter }

/** アプリが使う保存先。切り替える場合はここだけを変更する。 */
export const storage: StorageAdapter = localStorageAdapter
