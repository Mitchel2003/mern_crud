/** Este módulo proporciona funciones para la gestión de notificaciones push con Firebase Cloud Messaging */
import { messagingService as messagingFB } from "@/services/firebase/messaging.service";
import { normalizeError } from "@/errors/handler";
import ErrorAPI from "@/errors";

/*--------------------------------------------------messaging token--------------------------------------------------*/
/**
 * Nos permite obtener el token de Firebase Cloud Messaging (FCM) para las notificaciones push.
 * Verifica si el navegador soporta Service Workers, registra el script del worker y espera a que se active.
 * @returns {Promise<string>} - Retorna el token generado
 */
export const getTokenMessaging = async (): Promise<string> => {
  try {
    // Register or retrieve the service worker
    const registration = await registerServiceWorker()
    // Request the FCM token
    console.log('Solicitando token FCM...');//check control
    const result = await messagingFB.getTokenCloudMessaging(registration);
    // Verify if the request was successful
    if (!result.success) throw new ErrorAPI(result.error)
    console.log('Token FCM obtenido correctamente');//check control
    return result.data;
  } catch (e: unknown) { throw new ErrorAPI(normalizeError(e, 'obtener token Firebase Cloud Messaging')) }
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
    console.log('Registrando service worker para Firebase Cloud Messaging...');//check control
    const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js', { scope: '/', type: 'classic', updateViaCache: 'none' })
    await navigator.serviceWorker.ready //wait for service worker to be ready
    // Send configuration to service worker active
    if (navigator.serviceWorker.controller) {
      console.log('Enviando configuración de Firebase al service worker...');//check control
      navigator.serviceWorker.controller.postMessage({ type: 'SET_FIREBASE_CONFIG', config: (window as any).__FIREBASE_CONFIG__ })
    }

    // If the service worker is installing, wait for activation
    if (registration.installing) {
      console.log('Service worker instalándose, esperando activación...');//check control
      await new Promise<void>((resolve) => {
        registration.installing?.addEventListener('statechange', (e) => {
          if ((e.target as ServiceWorker).state === 'activated') {
            console.log('Service worker activado');//check control
            if (registration.active) {// Send configuration to the newly activated service worker
              registration.active.postMessage({ type: 'SET_FIREBASE_CONFIG', config: (window as any).__FIREBASE_CONFIG__ })
            }
            resolve()
          }
        })
      })
    } else if (registration.active) {
      console.log('Service worker ya activo, enviando configuración...');//check control
      registration.active.postMessage({ type: 'SET_FIREBASE_CONFIG', config: (window as any).__FIREBASE_CONFIG__ })
    }

    console.log('Service worker registrado correctamente');//check control
    return registration;
  } catch (e) { throw new ErrorAPI(normalizeError(e, 'registrar script del worker')) }
}