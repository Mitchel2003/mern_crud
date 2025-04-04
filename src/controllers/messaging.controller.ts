/** Este módulo proporciona funciones para la gestión de notificaciones push con Firebase Cloud Messaging */
import { messagingService as messagingFB } from "@/services/firebase/messaging.service"
import { normalizeError } from "@/errors/handler"
import ErrorAPI from "@/errors"

/*--------------------------------------------------messaging token--------------------------------------------------*/
/**
 * Nos permite obtener el token de Firebase Cloud Messaging (FCM) para las notificaciones push.
 * @returns {Promise<string>} - Retorna el token generado
 */
export const getTokenMessaging = async (): Promise<string> => {
  try {
    const result = await messagingFB.getTokenCloudMessaging()
    if (!result.success) throw new ErrorAPI(result.error)
    return result.data
  } catch (e) { throw new ErrorAPI(normalizeError(e, 'obtener token Firebase Cloud Messaging')) }
}