/** Este módulo proporciona funciones para la gestión de autenticación con Firebase Authentication */
import { authService as authFB } from "@/services/firebase/auth.service"
import { normalizeError } from "@/errors/handler"
import ErrorAPI, { NotFound } from "@/errors"
import { User } from "firebase/auth"

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
    if (!auth.success) throw auth.error //is ErrorAPI
    const idToken = await auth.data.user.getIdToken()
    localStorage.setItem("token", idToken) //store token
    return auth.data.user //user auth-firebase on context
  } catch (e) { throw e instanceof ErrorAPI ? e : new ErrorAPI(normalizeError(e, 'iniciar sesión')) }
}
/**
 * Maneja el proceso de cierre de sesión del usuario.
 * Cierra la session actual del usuario en firebase
 */
export const logout = async (): Promise<void> => {
  try {
    const result = await authFB.logout()
    if (!result.success) throw result.error
  } catch (e) { throw e instanceof ErrorAPI ? e : new ErrorAPI(normalizeError(e, 'cerrar sesión')) }
}
/*---------------------------------------------------------------------------------------------------------*/

/*--------------------------------------------------state--------------------------------------------------*/
/**
 * Obtiene el estado actual de autenticación del usuario de forma sincrónica.
 * @returns {User | null} - El usuario autenticado o null si no hay sesión activa.
 */
export const getCurrentUser = (): User | null => {
  try { return authFB.getCurrentUser() }
  catch (e) { throw e instanceof ErrorAPI ? e : new ErrorAPI(normalizeError(e, 'obtener usuario actual')) }
}
/**
 * Obtiene un nuevo token de autenticación renovado.
 * @returns {string} - El nuevo token de autenticación renovado.
 */
export const getRefreshToken = async (): Promise<string> => {
  try {
    const result = await authFB.refreshToken()
    if (!result.success) throw result.error //is ErrorAPI
    if (!result.data) throw new NotFound({ message: 'refrescar token' })
    localStorage.setItem('token', result.data) // Store new token in localStorage
    return result.data // Return new token to be used on requests (axios interceptor)
  } catch (e) { throw e instanceof ErrorAPI ? e : new ErrorAPI(normalizeError(e, 'obtener token renovado')) }
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
    if (!result.success) throw result.error //is ErrorAPI
  } catch (e) { throw e instanceof ErrorAPI ? e : new ErrorAPI(normalizeError(e, 'enviar email de restablecimiento de contraseña')) }
}
/**
 * Suscribe una función callback a los cambios de estado de autenticación
 * @param {function} callback - Función que se ejecutará cuando cambie el estado de autenticación
 * @returns {function} - Función para cancelar la suscripción
*/
export const subscribeAuthChanges = (callback: (user: User | null) => void): (() => void) => {
  try { return authFB.subscribeAuthChanges(callback) }
  catch (e) { throw e instanceof ErrorAPI ? e : new ErrorAPI(normalizeError(e, 'suscribir cambios de autenticación')) }
}
/*---------------------------------------------------------------------------------------------------------*/