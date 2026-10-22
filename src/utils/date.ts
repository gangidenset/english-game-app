/** 端末のローカル日付を YYYY-MM-DD で返す。 */
export function toDateKey(date: Date = new Date()): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

/** 日付キー a から b までの日数（b - a）。 */
export function daysBetween(a: string, b: string): number {
  const [ay, am, ad] = a.split('-').map(Number)
  const [by, bm, bd] = b.split('-').map(Number)
  // UTC で計算してサマータイム等の影響を避ける
  return Math.round((Date.UTC(by, bm - 1, bd) - Date.UTC(ay, am - 1, ad)) / 86_400_000)
}

/** ミリ秒を「1時間23分」「5分」のような表記にする。 */
export function formatDuration(ms: number): string {
  const totalMin = Math.floor(ms / 60_000)
  const h = Math.floor(totalMin / 60)
  const m = totalMin % 60
  if (h > 0) return `${h}時間${m}分`
  if (totalMin > 0) return `${m}分`
  return `${Math.floor(ms / 1000)}秒`
}
