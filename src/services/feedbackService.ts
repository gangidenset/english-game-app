/**
 * 効果音とバイブレーション。
 *
 * 効果音は Web Audio API で合成しているので、音声ファイルなしで動作し、オフラインでも鳴る。
 * 本格的な効果音を使う場合は public/sounds/ に音声ファイルを置き、ここで再生方法を差し替える。
 */
export type SoundKind = 'correct' | 'wrong' | 'combo' | 'clear' | 'gameover' | 'levelup'

type Note = [frequency: number, startSec: number, durationSec: number]

const SOUNDS: Record<SoundKind, { wave: OscillatorType; notes: Note[]; volume: number }> = {
  correct: { wave: 'triangle', volume: 0.25, notes: [[880, 0, 0.09], [1318.5, 0.08, 0.16]] },
  wrong: { wave: 'square', volume: 0.12, notes: [[196, 0, 0.12], [164.8, 0.12, 0.22]] },
  combo: { wave: 'triangle', volume: 0.25, notes: [[1046.5, 0, 0.07], [1318.5, 0.06, 0.07], [1568, 0.12, 0.18]] },
  clear: {
    wave: 'triangle',
    volume: 0.25,
    notes: [[523.3, 0, 0.12], [659.3, 0.12, 0.12], [784, 0.24, 0.12], [1046.5, 0.36, 0.4]],
  },
  gameover: { wave: 'sine', volume: 0.25, notes: [[392, 0, 0.2], [311.1, 0.2, 0.2], [261.6, 0.4, 0.5]] },
  levelup: {
    wave: 'square',
    volume: 0.1,
    notes: [[784, 0, 0.1], [988, 0.1, 0.1], [1175, 0.2, 0.1], [1568, 0.3, 0.45]],
  },
}

let ctx: AudioContext | null = null

function getContext(): AudioContext | null {
  if (typeof window === 'undefined' || !('AudioContext' in window)) return null
  ctx ??= new AudioContext()
  // iOS などではユーザー操作の後でないと鳴らないため、毎回 resume を試みる
  if (ctx.state === 'suspended') void ctx.resume()
  return ctx
}

export function playSound(kind: SoundKind, enabled: boolean): void {
  if (!enabled) return
  const ac = getContext()
  if (!ac) return
  const { wave, notes, volume } = SOUNDS[kind]
  const now = ac.currentTime
  for (const [freq, start, dur] of notes) {
    const osc = ac.createOscillator()
    const gain = ac.createGain()
    osc.type = wave
    osc.frequency.value = freq
    gain.gain.setValueAtTime(volume, now + start)
    gain.gain.exponentialRampToValueAtTime(0.0001, now + start + dur)
    osc.connect(gain).connect(ac.destination)
    osc.start(now + start)
    osc.stop(now + start + dur + 0.02)
  }
}

const VIBRATIONS: Partial<Record<SoundKind, number | number[]>> = {
  wrong: [60, 40, 60],
  gameover: 300,
  levelup: [40, 30, 40, 30, 80],
}

/** バイブレーション（Android のブラウザ・アプリで有効。iOS Safari は非対応）。 */
export function vibrate(kind: SoundKind, enabled: boolean): void {
  const pattern = VIBRATIONS[kind]
  if (!enabled || !pattern || typeof navigator === 'undefined' || !('vibrate' in navigator)) return
  navigator.vibrate(pattern)
}

/** 効果音とバイブレーションをまとめて鳴らす。 */
export function feedback(kind: SoundKind, settings: { sound: boolean; vibration: boolean }): void {
  playSound(kind, settings.sound)
  vibrate(kind, settings.vibration)
}
