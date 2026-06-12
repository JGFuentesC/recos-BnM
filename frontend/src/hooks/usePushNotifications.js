import { getMessaging, getToken, onMessage } from 'firebase/messaging'
import { doc, updateDoc } from 'firebase/firestore'
import { db, messaging } from '../firebase/config'

export function usePushNotifications(currentUser) {
  const requestPermission = async (activeUser = currentUser) => {
    try {
      if (!activeUser || typeof window === 'undefined' || !('Notification' in window)) {
        return null
      }

      const permission = await Notification.requestPermission()
      if (permission !== 'granted') {
        return null
      }

      const activeMessaging = messaging ?? getMessaging()
      const token = await getToken(activeMessaging, {
        vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
      })

      if (token) {
        await updateDoc(doc(db, 'users', activeUser.uid), {
          fcmToken: token,
          notificationsEnabled: true,
        })
      }

      return token
    } catch {
      return null
    }
  }

  const listenForegroundMessages = (handler) => {
    if (!messaging || typeof handler !== 'function') {
      return () => {}
    }

    return onMessage(messaging, handler)
  }

  return { requestPermission, listenForegroundMessages }
}