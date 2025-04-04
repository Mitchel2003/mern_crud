/** Este módulo proporciona funciones para la gestión de autenticación con Firebase Authentication */
import { authService as authFB } from "@/services/firebase/auth.service"
import { AccountProps } from "@/interfaces/db.interface"
import { normalizeError } from "@/errors/handler"
import { User } from "firebase/auth"
import ErrorAPI from "@/errors"

/*--------------------------------------------------auth--------------------------------------------------*/
/**
 * Maneja el proceso de inicio de sesión del usuario.
 * Obtiene el token de usuario y lo almacena en localStorage 
 * @param {string} email - El email del usuario.
 * @param {string} password - La contraseña del usuario.
 * @returns {Promise<User>} - Envía el usuario autenticado o un mensaje de error.
 */
export const login = async (email: string, password: string): Promise<User> => {
  try {
    const auth = await authFB.login(email, password)
    if (!auth.success) throw new ErrorAPI(auth.error)
    const user: User = auth.data.user
    const idToken = await user.getIdToken()
    localStorage.setItem("token", idToken)
    return user
  } catch (e) { throw new ErrorAPI(normalizeError(e, 'iniciar sesión')) }
}
/**
 * Maneja el proceso de registro de un nuevo usuario.
 * crea el usuario en firebase y envia un email de verificacion (authentication)
 * @param {AccountProps} data - Objeto con las credenciales del usuario.
 * @returns {Promise<User>} - Envía el usuario creado o un mensaje de error.
 */
export const signin = async (data: AccountProps): Promise<User> => {
  try {
    const auth = await authFB.registerAccount(data)
    if (!auth.success) throw new ErrorAPI(auth.error)
    const sendEmail = await authFB.sendEmailVerification()
    if (!sendEmail.success) throw new ErrorAPI(sendEmail.error)
    return auth.data
  } catch (e) { throw new ErrorAPI(normalizeError(e, 'registrarse')) }
}
/**
 * Maneja el proceso de cierre de sesión del usuario.
 * Cierra la session actual del usuario en firebase
 */
export const logout = async (): Promise<void> => {
  try {
    const result = await authFB.logout()
    if (!result.success) throw new ErrorAPI(result.error)
  } catch (e) { throw new ErrorAPI(normalizeError(e, 'cerrar sesión')) }
}
/*---------------------------------------------------------------------------------------------------------*/

/*--------------------------------------------------verify--------------------------------------------------*/
/**
 * Maneja el proceso de restablecimiento de contraseña.
 * Envia un email con el token de restablecimiento de contraseña el cual expirará en 1 hora.
 * @param {string} email - El email del usuario a restablecer.
 */
export const forgotPassword = async (email: string): Promise<void> => {
  try {
    const result = await authFB.sendEmailResetPassword(email)
    if (!result.success) throw new ErrorAPI(result.error)
  } catch (e) { throw new ErrorAPI(normalizeError(e, 'enviar email de restablecimiento de contraseña')) }
}
/**
 * Obtiene el estado actual de autenticación del usuario de forma sincrónica
 * @returns {User | null} - El usuario autenticado o null si no hay sesión activa
 */
export const getCurrentUser = (): User | null => {
  try { return authFB.getCurrentUser() }
  catch (e) { throw new ErrorAPI(normalizeError(e, 'obtener usuario actual')) }
}
/**
 * Suscribe una función callback a los cambios de estado de autenticación
 * @param {function} callback - Función que se ejecutará cuando cambie el estado de autenticación
 * @returns {function} - Función para cancelar la suscripción
 */
export const subscribeAuthChanges = (callback: (user: User | null) => void): (() => void) => {
  try { return authFB.subscribeAuthChanges(callback) }
  catch (e) { throw new ErrorAPI(normalizeError(e, 'suscribir cambios de autenticación')) }
}
/*---------------------------------------------------------------------------------------------------------*/