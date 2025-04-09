/** Este módulo proporciona funciones para la gestión de notificaciones push con Firebase Cloud Messaging */
import { messagingService as messagingFB } from "@/services/firebase/messaging.service"
import { normalizeError } from "@/errors/handler"
import { Unsubscribe } from "firebase/auth"
import ErrorAPI from "@/errors"

/*--------------------------------------------------messaging token--------------------------------------------------*/
/**
 * Nos permite obtener el token de Firebase Cloud Messaging (FCM) para las notificaciones push.
 * @returns {Promise<string>} - Retorna el token generado
 */
export const getTokenMessaging = async (): Promise<string> => {
  try {
    const result = await messagingFB.getTokenCloudMessaging()
    if (!result.success) throw result.error //is ErrorAPI
    return result.data //token firebase cloud messaging
  } catch (e) { throw e instanceof ErrorAPI ? e : new ErrorAPI(normalizeError(e, 'obtener token Firebase Cloud Messaging')) }
}
/*---------------------------------------------------------------------------------------------------------*/

/*--------------------------------------------------notifications--------------------------------------------------*/
/**
 * Configura un listener para recibir mensajes en primer plano
 * @param {Function} callback - Función que se ejecutará cuando se reciba un mensaje
 * @returns {Promise<Unsubscribe>} - Función para cancelar la suscripción
 */
export const listenMessages = async (callback: (payload: any) => void): Promise<Unsubscribe> => {
  try {
    const result = await messagingFB.setupMessageListener(callback)
    if (!result.success) throw result.error //is ErrorAPI
    return result.data //unsubscribe function to stop listening
  } catch (e) { throw e instanceof ErrorAPI ? e : new ErrorAPI(normalizeError(e, 'configurar listener de mensajes')) }
}
/*---------------------------------------------------------------------------------------------------------*/