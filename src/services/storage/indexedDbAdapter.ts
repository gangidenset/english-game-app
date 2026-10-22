import { APP_CONFIG } from '../../config/app'
import type { StorageAdapter } from './StorageAdapter'

const DB_VERSION = 1
const STORE = 'kv'

let dbPromise: Promise<IDBDatabase> | null = null

function openDb(): Promise<IDBDatabase> {
  dbPromise ??= new Promise((resolve, reject) => {
    const req = indexedDB.open(APP_CONFIG.storageNamespace, DB_VERSION)
    req.onupgradeneeded = () => {
      if (!req.result.objectStoreNames.contains(STORE)) req.result.createObjectStore(STORE)
    }
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error)
  })
  return dbPromise
}

function request<T>(mode: IDBTransactionMode, run: (store: IDBObjectStore) => IDBRequest): Promise<T> {
  return openDb().then(
    (db) =>
      new Promise<T>((resolve, reject) => {
        const tx = db.transaction(STORE, mode)
        const req = run(tx.objectStore(STORE))
        tx.oncomplete = () => resolve(req.result as T)
        tx.onerror = () => reject(tx.error)
        tx.onabort = () => reject(tx.error)
      }),
  )
}

/**
 * IndexedDB を使った StorageAdapter 実装。
 * localStorage より容量が大きく（数 MB 以上）、問題数・履歴が増えても安心。
 */
export const indexedDbAdapter: StorageAdapter = {
  async get<T>(key: string): Promise<T | null> {
    const value = await request<T | undefined>('readonly', (s) => s.get(key))
    return value ?? null
  },
  async set<T>(key: string, value: T): Promise<void> {
    await request('readwrite', (s) => s.put(value, key))
  },
  async remove(key: string): Promise<void> {
    await request('readwrite', (s) => s.delete(key))
  },
}

export function isIndexedDbAvailable(): boolean {
  try {
    return typeof indexedDB !== 'undefined' && indexedDB !== null
  } catch {
    return false
  }
}
