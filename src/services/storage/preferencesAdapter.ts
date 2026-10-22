import { Preferences } from '@capacitor/preferences'
import type { StorageAdapter } from './StorageAdapter'

/**
 * Capacitor Preferences を使った StorageAdapter（Android / iOS アプリ用）。
 * ネイティブの保存領域（Android: SharedPreferences / iOS: UserDefaults）に保存するため、
 * WebView のキャッシュ削除などで学習データが消えにくい。
 */
export const preferencesAdapter: StorageAdapter = {
  async get<T>(key: string): Promise<T | null> {
    const { value } = await Preferences.get({ key })
    if (value === null) return null
    try {
      return JSON.parse(value) as T
    } catch {
      return null
    }
  },
  async set<T>(key: string, value: T): Promise<void> {
    await Preferences.set({ key, value: JSON.stringify(value) })
  },
  async remove(key: string): Promise<void> {
    await Preferences.remove({ key })
  },
}
