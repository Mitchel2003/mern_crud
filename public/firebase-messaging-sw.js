// Import Firebase scripts
importScripts('https://www.gstatic.com/firebasejs/10.7.2/firebase-app-compat.js')
importScripts('https://www.gstatic.com/firebasejs/10.7.2/firebase-messaging-compat.js')

// Initialize Firebase
firebase.initializeApp({
  apiKey: "AIzaSyCjKw582WVzAgwxfsYqQsi-2j0wCxtvHAo",
  appId: "1:230825792921:web:31b62b2e4005df4e866f08",
  authDomain: "gestionsalud-2003.firebaseapp.com",
  storageBucket: "gestionsalud-2003.appspot.com",
  messagingSenderId: "230825792921",
  projectId: "gestionsalud-2003",
  measurementId: "G-XBY19E9TQG"
})
const messaging = firebase.messaging()

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  try {
    if (payload.data) {// Verificar si es un dispositivo móvil (Android/iOS)
      const isMobile = /Android|iPhone|iPad|iPod/i.test(self.navigator.userAgent)
      if (payload.notification && isMobile) return
      const notificationTitle = payload.data.title || payload.notification?.title || 'Nueva notificación'
      const notificationOptions = {
        body: payload.data.body || payload.notification?.body || 'Tienes una nueva notificación',
        badge: '/assets/gs_ico.ico',
        icon: '/assets/gs_ico.ico',
        data: payload.data
      }
      return self.registration.showNotification(notificationTitle, notificationOptions)
    }

    if (payload.notification) {
      const notificationTitle = payload.notification.title || 'Nueva notificación'
      const notificationOptions = {
        body: payload.notification.body || 'Tienes una nueva notificación',
        badge: '/assets/gs_ico.ico',
        icon: '/assets/gs_ico.ico',
      }
      return self.registration.showNotification(notificationTitle, notificationOptions)
    }
  } catch (error) { console.error('[firebase-messaging-sw.js] Error al mostrar notificación:', error) }
})