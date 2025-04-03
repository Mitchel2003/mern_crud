import { AuthService as IAuth } from "@/interfaces/db.interface"
import { handlerService as handler } from "@/errors/handler"
import { AccountProps } from "@/interfaces/db.interface"
import { Result } from "@/interfaces/db.interface"
import { firebaseApp } from "@/services/db"
import { NotFound } from "@/errors"

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  sendEmailVerification,
  onAuthStateChanged,
  UserCredential,
  updateProfile,
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
    this.setupAuthObserver()
    this.setupTokenExpiration()
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
  /**
   * Creates a user with credentials in Firebase.
   * We use user properties (UserInfo) to save the profile,
   * @param {AccountProps} credentials - Contains the primary user information (form register)
   * @returns {Promise<Result<User>>} - Returns the user if the credentials are valid, or an error if they are not.
   * @example photoURL - example: 'role;permissions;phone;nit;invima;profesionalLicense'
   */
  async registerAccount(credentials: AccountProps): Promise<Result<User>> {
    return handler(async () => {
      const { role, phone, nit, invima, profesionalLicense, permissions } = credentials;
      const dataStr = `${role};${permissions ? JSON.stringify(permissions) : '[]'}
        ;${phone};${nit ?? ''};${invima ?? ''};${profesionalLicense ?? ''}`;
      const res = await createUserWithEmailAndPassword(this.auth, credentials.email, credentials.password);
      await updateProfile(res.user, { displayName: credentials.username, photoURL: dataStr });
      return res.user;
    }, 'crear usuario (Firebase Auth)')
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
   * @param {string} email - The user's email.
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
   * Configura un único observador para cambios en el estado de autenticación
   * Este método se llama una sola vez durante la inicialización
   * @private
   */
  private setupAuthObserver(): void {
    if (this.authStateUnsubscribe) { this.authStateUnsubscribe() }// Clean previous subscription
    this.authStateUnsubscribe = onAuthStateChanged(this.auth, async (user) => {// Create new subscription
      AuthService.user = user;
      if (user) {//if exist, refresh token auth
        const newToken = await user.getIdToken(true)
        localStorage.setItem('token', newToken)
      } else { localStorage.removeItem('token') }//if not exist user, remove token
      this.authStateListeners.forEach(listener => listener(user))// Notify to all listeners
    })
  }
  /**
   * Configura un listener para el evento de token a punto de expirar
   * Este método se llama una sola vez durante la inicialización
   * (Bind) para preservar el estado en contexto
   * @private
   */
  private setupTokenExpiration(): void {
    this.handleTokenExpiring = this.handleTokenExpiring.bind(this)
    window.addEventListener('token-expiring', this.handleTokenExpiring)
  }
  /*---------------------------------------------------------------------------------------------------------*/

  /*--------------------------------------------------helpers--------------------------------------------------*/
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
   * Cleans up resources when the service is no longer needed
   * Primarily for testing and cases where we need to restart the service
   */
  public cleanup(): void {
    if (this.authStateUnsubscribe) {
      this.authStateUnsubscribe()
      this.authStateUnsubscribe = null
    }
    this.authStateListeners.clear()
    window.removeEventListener('token-expiring', this.handleTokenExpiring)
  }
  /**
   * Maneja el evento de token a punto de expirar
   * Renueva el token automáticamente si hay un usuario autenticado
   */
  private handleTokenExpiring = async (): Promise<void> => {
    handler(async () => {
      const user = this.getCurrentUser()
      if (!user) throw new Error('Usuario no autenticado')
      const newToken = await user.getIdToken(true)
      localStorage.setItem('token', newToken)
    }, 'renovar token')
  }
}
/*---------------------------------------------------------------------------------------------------------*/
export const authService = AuthService.getInstance()