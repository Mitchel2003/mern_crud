import { handlerService as handler, normalizeError } from "@/errors/handler"
import { AuthService as IAuth } from "@/interfaces/db.interface"
import { Result } from "@/interfaces/db.interface"
import ErrorAPI, { NotFound } from "@/errors"
import { firebaseApp } from "@/services/db"
import {
  signInWithEmailAndPassword,
  browserLocalPersistence,
  sendPasswordResetEmail,
  sendEmailVerification,
  onAuthStateChanged,
  setPersistence,
  UserCredential,
  Unsubscribe,
  getAuth,
  signOut,
  Auth,
  User,
} from "firebase/auth"

/**
 * Consist on a class that works above an instance auth
 * Have various functions like observer, verification or overwrite data
 */
class AuthService implements IAuth {
  private auth: Auth
  private static instance: AuthService
  private static user: User | null = null
  private authStateUnsubscribe: Unsubscribe | null = null
  private authStateListeners: Set<(user: User | null) => void> = new Set()

  private constructor() {
    this.auth = getAuth(firebaseApp)
    const storedUid = localStorage.getItem('uid')
    const existingToken = localStorage.getItem('token')
    if (existingToken && storedUid) AuthService.user = { uid: storedUid } as User
    setPersistence(this.auth, browserLocalPersistence).then(() => { this.setupAuthObserver() })
      .catch((e) => { this.setupAuthObserver(); throw new ErrorAPI(normalizeError(e, 'configurar persistencia')) })
  }

  /**
   * Returns the singleton instance of AuthService.
   * If the instance does not exist, it creates a new one.
   * @returns {AuthService} The singleton instance of AuthService.
   */
  public static getInstance(): AuthService {
    if (!AuthService.instance) AuthService.instance = new AuthService()
    return AuthService.instance
  }

  /*--------------------------------------------------authentication--------------------------------------------------*/
  /**
   * Closes the user's session in the context.
   * @returns {Promise<Result<void>>} - Returns a success message if the session is closed successfully.
   */
  async logout(): Promise<Result<void>> {
    return handler(async () => await signOut(this.auth), 'cerrar sesión')
  }
  /**
   * Executes the login process by verifying credentials.
   * @param {string} email - The user's email.
   * @param {string} password - The user's password.
   * @returns {Promise<Result<UserCredential>>} - Returns the user credentials if the credentials are valid
   */
  async login(email: string, password: string): Promise<Result<UserCredential>> {
    return handler(async () => await signInWithEmailAndPassword(this.auth, email, password), 'verificar credenciales')
  }
  /*---------------------------------------------------------------------------------------------------------*/

  /*--------------------------------------------------actions requests--------------------------------------------------*/
  /**
   * Sends an email verification to the email in the authentication context.
   * @returns {Promise<Result<void>>} - Executes the request and returns a state (success or failure).
   */
  async sendEmailVerification(): Promise<Result<void>> {
    return handler(async () => {
      if (!this.auth.currentUser) throw new NotFound({ message: 'Usuario (auth)' })
      await sendEmailVerification(this.auth.currentUser)
    }, 'enviar correo de verificación')
  }
  /**
   * Sends a password reset email to the email provided by the user.
   * The redirect link is defined in the firebase configuration file (templates).
   * @param {string} email - The user's email to send reset password message to inbox.
   * @returns {Promise<Result<void>>} - Executes the request and returns a state (success or failure).
   */
  async sendEmailResetPassword(email: string): Promise<Result<void>> {
    return handler(async () => await sendPasswordResetEmail(this.auth, email), 'enviar correo de restablecimiento de contraseña')
  }
  /*---------------------------------------------------------------------------------------------------------*/

  /*--------------------------------------------------handlers state--------------------------------------------------*/
  /** Returns the current user or null if there is no authenticated user */
  getCurrentUser(): User | null { return AuthService.user }
  /**
   * Configures a unique observer for changes in the authentication state
   * This method is called only once during initialization @private
   */
  private setupAuthObserver(): void {
    if (this.authStateUnsubscribe) { this.authStateUnsubscribe() }// Clean previous subscription
    if (localStorage.getItem('token')) this.existingToken()// If token exists, set user (uid)
    this.authStateUnsubscribe = onAuthStateChanged(this.auth, async (user) => {
      AuthService.user = user// Define current user with the authentication state
      if (!user) { localStorage.removeItem('token'); localStorage.removeItem('uid'); return }
      const newToken = await user.getIdToken(true)
      localStorage.setItem('token', newToken)
      localStorage.setItem('uid', user.uid)
      this.authStateListeners.forEach(listener => listener(user))
    }, (e) => { throw new ErrorAPI(normalizeError(e, 'observador de autenticación')) })
  }
  /*---------------------------------------------------------------------------------------------------------*/

  /*--------------------------------------------------helpers--------------------------------------------------*/
  /** Set the user state listeners with the existing user */
  private existingToken(): void {
    const storedUid = localStorage.getItem('uid')
    storedUid && this.authStateListeners.forEach(listener => listener({ uid: storedUid } as User))
  }
  /**
   * Allows subscription to changes in the authentication state
   * @param {function} listener - Callback function that will be executed when the authentication state changes
   * @returns {function} - Function to cancel the subscription
   */
  public subscribeAuthChanges(listener: (user: User | null) => void): () => void {
    this.authStateListeners.add(listener)
    listener(AuthService.user)
    return () => { this.authStateListeners.delete(listener) }
  }
  /**
   * Gets a fresh token from the current user
   * Useful when a token expiration error is received
   * @returns {Promise<Result<string | null>>} - Executes a token refresh and returns a state (success or failure).
   */
  public async refreshToken(): Promise<Result<string | null>> {
    return handler(async () => {
      if (!this.auth.currentUser) return null
      return await this.auth.currentUser.getIdToken(true)
    }, 'obtener token renovado')
  }
}
/*---------------------------------------------------------------------------------------------------------*/
export const authService = AuthService.getInstance()