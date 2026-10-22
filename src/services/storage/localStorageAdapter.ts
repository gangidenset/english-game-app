import { APP_CONFIG } from '../../config/app'
import type { StorageAdapter } from './StorageAdapter'

const prefix = `${APP_CONFIG.storageNamespace}:`

/** localStorage を使った StorageAdapter 実装（初期版）。 */
export const localStorageAdapter: StorageAdapter = {
  async get<T>(key: string): Promise<T | null> {
    const raw = localStorage.getItem(prefix + key)
    if (raw === null) return null
    try {
      return JSON.parse(raw) as T
    } catch {
      // 壊れたデータは読み捨てる
      return null
    }
  },

  async set<T>(key: string, value: T): Promise<void> {
    localStorage.setItem(prefix + key, JSON.stringify(value))
  },

  async remove(key: string): Promise<void> {
    localStorage.removeItem(prefix + key)
  },
}
