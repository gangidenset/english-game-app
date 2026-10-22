import { App } from '@capacitor/app'
import { useEffect, useRef } from 'react'
import { platform } from './native'

/**
 * Android の「戻る」ボタン（ジェスチャー）の処理。
 * handler が false を返したらアプリを閉じる（ホーム画面にいるとき）。
 */
export function useAndroidBackButton(handler: () => boolean) {
  const handlerRef = useRef(handler)
  useEffect(() => {
    handlerRef.current = handler
  }, [handler])

  useEffect(() => {
    if (platform !== 'android') return
    const listener = App.addListener('backButton', () => {
      if (!handlerRef.current()) void App.exitApp()
    })
    return () => {
      void listener.then((l) => l.remove())
    }
  }, [])
}
