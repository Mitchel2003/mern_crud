import { Messaging, getMessaging, getToken, onMessage, isSupported, Unsubscribe } from "firebase/messaging"
import { MessagingService as IMessaging, Result } from "@/interfaces/db.interface"
import { handlerService as handler } from "@/errors/handler"
import { firebaseApp } from "@/services/db"
import config from "@/utils/config"
import ErrorAPI from "@/errors"

/**
 * Service to manage Firebase Cloud Messaging (FCM)
 * Provides functionality to obtain tokens, subscribe to topics, and receive notifications
 */
class MessagingService implements IMessaging {
  private messaging: Messaging
  private static instance: MessagingService
  private constructor() { this.messaging = getMessaging(firebaseApp) }

  /**
   * Returns the singleton instance of MessagingService.
   * If the instance does not exist, it creates a new one.
   * @returns {MessagingService} The singleton instance of MessagingService.
   */
  public static getInstance(): MessagingService {
    if (!MessagingService.instance) MessagingService.instance = new MessagingService()
    return MessagingService.instance
  }

  /*---------------> helpers <---------------*/
  /**
   * Verifies if the browser supports Firebase Cloud Messaging
   * @returns {Promise<Result<boolean>>} - Returns true if the browser supports FCM, false otherwise
   */
  async isSupported(): Promise<Result<boolean>> {
    return handler(async () => await isSupported(), 'verificar soporte de Firebase Cloud Messaging')
  }
  /**
   * Configures a listener for messages in the foreground
   * @param {Function} callback - Function to execute when a message is received
   */
  async setupMessageListener(callback: (payload: any) => void): Promise<Result<Unsubscribe>> {
    return handler(async () => onMessage(this.messaging, (payload) => callback(payload)), 'configurar listener de mensajes')
  }
  /*----------------------------------------------------*/

  /*---------------> actions requests <---------------*/
  /**
   * Handles the process of getting a token for Firebase Cloud Messaging (FCM).
   * @returns {Promise<Result<string>>} - Returns the token if the request is successful, or an error if it fails.
   */
  async getTokenCloudMessaging(): Promise<Result<string>> {
    return handler(async () => {
      const supported = await this.isSupported()
      if (!supported.success) throw new ErrorAPI(supported.error)
      return getToken(this.messaging, { vapidKey: config.vapidKey })
    }, 'obtener token Firebase Cloud Messaging')
  }
}
/*---------------------------------------------------------------------------------------------------------*/
export const messagingService = MessagingService.getInstance()