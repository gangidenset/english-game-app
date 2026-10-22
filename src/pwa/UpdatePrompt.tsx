import { useRegisterSW } from 'virtual:pwa-register/react'
import { Button } from '../components/Button'
import { Toast } from '../components/Toast'

/**
 * Service Worker の登録と、更新・オフライン対応のお知らせ。
 * バトル中に勝手に再読み込みしないよう、ホーム画面にだけ表示する。
 */
export function UpdatePrompt() {
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    offlineReady: [offlineReady, setOfflineReady],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisterError(error) {
      console.warn('Service Worker の登録に失敗しました', error)
    },
  })

  if (needRefresh) {
    return (
      <Toast>
        <span>新しいバージョンがあります</span>
        <Button size="sm" onClick={() => updateServiceWorker(true)}>
          更新
        </Button>
        <Button size="sm" variant="ghost" onClick={() => setNeedRefresh(false)}>
          あとで
        </Button>
      </Toast>
    )
  }
  if (offlineReady) {
    return (
      <Toast>
        <span>📶 オフラインでも遊べるようになりました</span>
        <Button size="sm" variant="ghost" onClick={() => setOfflineReady(false)}>
          OK
        </Button>
      </Toast>
    )
  }
  return null
}
