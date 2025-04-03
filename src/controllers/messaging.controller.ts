/** Este módulo proporciona funciones para la gestión de notificaciones push con Firebase Cloud Messaging */
import { messagingService as messagingFB } from "@/services/firebase/messaging.service"
import { normalizeError } from "@/errors/handler"
import ErrorAPI from "@/errors"

/*--------------------------------------------------messaging token--------------------------------------------------*/
/**
 * Nos permite obtener el token de Firebase Cloud Messaging (FCM) para las notificaciones push.
 * Verifica si el navegador soporta Service Workers, registra el script del worker y espera a que se active.
 * @returns {Promise<string>} - Retorna el token generado
 */
export const getTokenMessaging = async (): Promise<string> => {
  try {
    const registration = await registerServiceWorker()
    const result = await messagingFB.getTokenCloudMessaging(registration)
    if (!result.success) throw new ErrorAPI(result.error)
    return result.data
  } catch (e) { throw new ErrorAPI(normalizeError(e, 'obtener token Firebase Cloud Messaging')) }
}
/*---------------------------------------------------------------------------------------------------------*/

/*--------------------------------------------------service worker--------------------------------------------------*/
/**
 * Registra el service worker para Firebase Cloud Messaging y envía la configuración.
 * @returns {Promise<ServiceWorkerRegistration>} - Retorna el registro del service worker
 */
async function registerServiceWorker(): Promise<ServiceWorkerRegistration> {
  try {
    if (!('serviceWorker' in navigator)) throw new Error('Este navegador no soporta Service Workers, necesarios para las notificaciones push')
    const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js', { scope: '/', type: 'classic', updateViaCache: 'none' })
    await navigator.serviceWorker.ready //wait for service worker to be ready    
    if (navigator.serviceWorker.controller) {// Send configuration to service worker active
      navigator.serviceWorker.controller.postMessage({ type: 'SET_FIREBASE_CONFIG', config: (window as any).__FIREBASE_CONFIG__ })
    }
    if (registration.installing) {// If the service worker is installing, wait for activation
      await new Promise<void>((resolve) => {
        registration.installing?.addEventListener('statechange', (e) => {
          if ((e.target as ServiceWorker).state === 'activated') {
            if (registration.active) {// Send configuration to the newly activated service worker
              registration.active.postMessage({ type: 'SET_FIREBASE_CONFIG', config: (window as any).__FIREBASE_CONFIG__ })
            }
            resolve()
          }
        })
      })
    } else if (registration.active) {
      registration.active.postMessage({ type: 'SET_FIREBASE_CONFIG', config: (window as any).__FIREBASE_CONFIG__ })
    }
    return registration //Service worker registered correctly
  } catch (e) { throw new ErrorAPI(normalizeError(e, 'registrar script del worker')) }
}