import type { StorageAdapter } from './StorageAdapter'

/**
 * primary が失敗したら secondary を使う StorageAdapter。
 * （例：Safari のプライベートモードなどで IndexedDB が使えない場合に localStorage へ切り替える）
 */
export function withFallback(primary: StorageAdapter, secondary: StorageAdapter): StorageAdapter {
  let useSecondary = false
  const run = async <R>(op: (a: StorageAdapter) => Promise<R>): Promise<R> => {
    if (!useSecondary) {
      try {
        return await op(primary)
      } catch (e) {
        console.warn('保存先を切り替えます', e)
        useSecondary = true
      }
    }
    return op(secondary)
  }
  return {
    get: (key) => run((a) => a.get(key)),
    set: (key, value) => run((a) => a.set(key, value)),
    remove: (key) => run((a) => a.remove(key)),
  }
}
