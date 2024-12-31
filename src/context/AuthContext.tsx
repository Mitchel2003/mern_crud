import { AuthContext, User } from "@/interfaces/context.interface";
import { useNotification } from "@/hooks/ui/useNotification";
import { isAxiosResponse } from "@/interfaces/db.interface";
import { useLoadingScreen } from "@/hooks/ui/useLoading";
import { Props } from "@/interfaces/props.interface";
import { useApi } from "@/api/handler";

import { createContext, useContext, useEffect, useState } from "react";
import { AxiosResponse } from "axios";

const Auth = createContext<AuthContext>(undefined)

/**
 * Hook personalizado para acceder al contexto de autenticación.
 * @throws {Error} Si se intenta usar fuera del AuthProvider.
 */
export const useAuthContext = () => {
  const context = useContext(Auth)
  if (!context) throw new Error('Error al intentar usar authContext')
  return context
}

/**
 * Proveedor del contexto de autenticación.
 * Maneja el estado de autenticación y proporciona funciones para iniciar sesión, registrarse y cerrar sesión.
 * @param {Props} props - Las propiedades del componente.
 * @returns {JSX.Element} Elemento JSX que envuelve a los hijos con el contexto de autenticación.
 */
export const AuthProvider = ({ children }: Props): JSX.Element => {
  const { show: showLoading, hide: hideLoading } = useLoadingScreen()
  const { notifySuccess, notifyError } = useNotification()
  const [loading, setLoading] = useState(true)
  const [isAuth, setIsAuth] = useState(false)
  const [user, setUser] = useState<User>(null)

  useEffect(() => { verifyAuth() }, [])
  /*--------------------------------------------------authentication--------------------------------------------------*/
  /**
   * Inicia sesión con las credenciales del usuario.
   * @param {object} credentials - Las credenciales del usuario.
   */
  const signin = async (credentials: object) => {
    setLoadingStatus("Iniciando sesión...")
    try {
      await useApi('login').create(credentials).then(res => setAuthStatus(res))
      notifySuccess({ title: "¡Bienvenido!", message: "Has iniciado sesión correctamente" })
    } catch (e: unknown) {
      setAuthStatus()
      isAxiosResponse(e) && notifyError({ title: "Error al iniciar sesión", message: e.response.data.message })
    } finally { setLoadingStatus() }
  }
  /**
   * Registra un nuevo usuario con los datos proporcionados.
   * @param {object} data - Los datos del nuevo usuario.
   */
  const signup = async (data: object) => {
    setLoadingStatus("Registrando usuario...")
    try {
      await useApi('register').create(data)
      notifySuccess({ title: "¡Registro exitoso!", message: "Hemos enviado un correo de verificación a tu cuenta" })
    } catch (e: unknown) {
      setAuthStatus()
      isAxiosResponse(e) && notifyError({ title: "Error en el registro", message: e.response.data.message })
    } finally { setLoadingStatus() }
  }
  /**
   * Cierra la sesión del usuario actual
   * permite cerrar el user.current de firebase/auth
   */
  const logout = async () => {
    setLoadingStatus("Cerrando sesión...")
    try {
      await useApi('logout').void().finally(() => setAuthStatus())
      notifySuccess({ title: "Sesión cerrada", message: "Has cerrado sesión correctamente" })
    } catch (e: unknown) {
      isAxiosResponse(e) && notifyError({ title: "Error al cerrar sesión", message: e.response.data.message })
    } finally { setLoadingStatus() }
  }
  /*---------------------------------------------------------------------------------------------------------*/

  /*--------------------------------------------------verification--------------------------------------------------*/
  /**
   * Permite enviar una solicitud de restablecimiento de contraseña
   * @param {string} email - Corresponde al email para enviar la solicitud.
   */
  const sendResetPassword = async (email: string) => {
    setLoadingStatus("Validando solicitud...")
    try {
      await useApi('forgot-password').void({ email })
      notifySuccess({ title: "Exito al enviar solicitud de restablecimiento de contraseña", message: "La solicitud se ha completado" })
    } catch (e: unknown) {
      isAxiosResponse(e) && notifyError({ title: "Error en la solicitud", message: e.response.data.message })
    } finally { setLoadingStatus() }
  }
  /*---------------------------------------------------------------------------------------------------------*/

  /*--------------------------------------------------helpers--------------------------------------------------*/
  /**
   * Actualiza el estado de autenticación basado en la respuesta del servidor.
   * @param {AxiosResponse | undefined} res - La respuesta del servidor.
   */
  const setAuthStatus = (res?: AxiosResponse) => {
    setUser(res?.data ?? null)
    setIsAuth(Boolean(res?.data))
  }
  /**
   * Actualiza el estado de carga basado en un parametro opcional
   * si valor del param es distinto a undefined, se muestra el loading
   * @param {string | undefined} status - El estado de carga.
   */
  const setLoadingStatus = (status?: string) => {
    setLoading(Boolean(status))
    status ? showLoading(status) : hideLoading()
  }
  /**
   * Verifica el estado de autenticación del usuario (auth)
   * logramos obtener un "user | null" segun corresponda
   */
  const verifyAuth = async (): Promise<void> => {
    try {
      const res = await useApi('on-auth').get()
      if (!res?.data) return setAuthStatus()
      setAuthStatus(res)
    } catch (e: unknown) {
      setAuthStatus()
      isAxiosResponse(e) && notifyError({ title: "Error solicitud de verificación", message: e.response.data.message })
    } finally { setLoading(false) }
  }
  /*---------------------------------------------------------------------------------------------------------*/
  return (
    <Auth.Provider value={{ isAuth, user, loading, signin, signup, logout, sendResetPassword }}>
      {children}
    </Auth.Provider>
  )
}