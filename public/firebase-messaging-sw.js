// Import Firebase scripts
importScripts('https://www.gstatic.com/firebasejs/10.7.2/firebase-app-compat.js')
importScripts('https://www.gstatic.com/firebasejs/10.7.2/firebase-messaging-compat.js')

// Global variable to store the messaging instance
let messagingInstance = null;

// Evento de instalación del service worker
self.addEventListener('install', (event) => {//activate immediately without waiting for existing tabs to close
  self.skipWaiting()
})

// Evento de activación del service worker
self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim())//claim control immediately
  self.clients.matchAll().then(clients => {//send Firebase config to all clients
    clients.forEach(client => {
      client.postMessage({ type: 'GET_FIREBASE_CONFIG' })
    })
  })
})

// Recibir mensajes de la aplicación principal
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SET_FIREBASE_CONFIG') {
    try {
      const config = event.data.config

      // Inicializar Firebase solo si no se ha hecho ya
      if (!self.firebase || !messagingInstance) {
        firebase.initializeApp(config)
        messagingInstance = firebase.messaging()

        // Configurar el manejador de mensajes en segundo plano
        messagingInstance.onBackgroundMessage((payload) => {
          try {
            const notificationTitle = payload.notification?.title || 'Nueva notificación'
            const notificationOptions = {
              body: payload.notification?.body || 'Tienes una nueva notificación',
              icon: '/assets/gs_ico.ico',
              badge: '/assets/gs_ico.ico',
              data: payload.data || {}
            }
            return self.registration.showNotification(notificationTitle, notificationOptions)
          } catch (error) { console.error('[firebase-messaging-sw.js] Error al mostrar notificación:', error) }
        })
        console.log('[firebase-messaging-sw.js] Firebase inicializado correctamente')
      }
    } catch (error) { console.error('[firebase-messaging-sw.js] Error al inicializar Firebase:', error) }
  }
})

// Handle clicks on notifications
self.addEventListener('notificationclick', (event) => {
  console.log('[firebase-messaging-sw.js] Clic en notificación')
  event.notification.close()
  const urlToOpen = event.notification.data?.url || '/'
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((clientList) => {
      // Try to find an open window to focus
      for (const client of clientList) {
        if (client.url === urlToOpen && 'focus' in client) return client.focus()
      }
      // If no windows are open, open a new one
      if (clients.openWindow) return clients.openWindow(urlToOpen)
    })
  )
})