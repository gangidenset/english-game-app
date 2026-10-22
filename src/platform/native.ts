import { Capacitor } from '@capacitor/core'

/**
 * Android / iOS アプリ（Capacitor）として動いているか。
 * Web（ブラウザ・PWA）では false。
 */
export const isNativeApp: boolean = Capacitor.isNativePlatform()

export const platform = Capacitor.getPlatform() as 'web' | 'android' | 'ios'
