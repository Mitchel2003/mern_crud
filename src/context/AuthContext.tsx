import { loginRequest, registerRequest, logoutRequest, verifyActionRequest, verifyAuthRequest } from "@/api/auth";
import { AuthContext, User } from "@/interfaces/context.interface";
import { useNotification } from "@/hooks/toast/useNotification"
import { isAxiosResponse } from "@/interfaces/db.interface";
import { Props } from "@/interfaces/props.interface";

import { createContext, useContext, useState, useEffect } from "react";
import { AxiosResponse } from "axios";
import Cookies from "js-cookie";

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
  const { Success, Error, Info } = useNotification()
  const [user, setUser] = useState<User>(undefined)
  const [loading, setLoading] = useState(true)
  const [isAuth, setIsAuth] = useState(false)

  useEffect(() => { verifyToken() }, [])

  /*--------------------------------------------------authentication--------------------------------------------------*/
  /** Verifica el token de autenticación almacenado en las cookies */
  const verifyToken = async () => {
    if (!Cookies.get().token) return setStatus()
    try {
      const res = await verifyAuthRequest();
      setStatus(res);
    } catch (e: unknown) {
      setStatus()
      isAxiosResponse(e) &&
        Error({ title: "Error de autenticación", message: e.response.data.message })
    }
  }
  /**
   * Inicia sesión con las credenciales del usuario.
   * @param {object} data - Las credenciales del usuario.
   */
  const signin = async (data: object) => {
    setLoading(true)
    try {
      const res = await loginRequest(data);
      setStatus(res)
      Success({ title: "¡Bienvenido!", message: "Has iniciado sesión correctamente" })
    } catch (e: unknown) {
      setStatus()
      isAxiosResponse(e) &&
        Error({ title: "Error al iniciar sesión", message: e.response.data.message })
    }
  }
  /**
   * Registra un nuevo usuario con los datos proporcionados.
   * @param {object} data - Los datos del nuevo usuario.
   */
  const signup = async (data: object) => {
    setLoading(true)
    try {
      await registerRequest(data);
      Success({ title: "¡Registro exitoso!", message: "Mira tu correo y activa tu cuenta" })
    } catch (e: unknown) {
      isAxiosResponse(e) &&
        Error({ title: "Error en el registro", message: e.response.data.message })
    } finally { setStatus() }
  }
  /**
   * Cierra la sesión del usuario actual
   * permite cerrar el user.current de firebase/auth
   */
  const logout = async () => {
    setLoading(true)
    try {
      await logoutRequest()
      Cookies.remove('token')
      Info({ title: "Sesión cerrada", message: "Has cerrado sesión correctamente" })
    } catch (e: unknown) {
      isAxiosResponse(e) &&
        Error({ title: "Error en el registro", message: e.response.data.message })
    } finally { setStatus() }
  }
  /*---------------------------------------------------------------------------------------------------------*/

  /*--------------------------------------------------verification--------------------------------------------------*/
  /**
   * Valida un tipo de solicitud publica (resetPassword or verifyEmail)
   * la petición se ejecuta a travez de un param "mode" explicito en la url 
   * @param {string} mode - Corresponde a la modalidad de la solicitud
   * @param {object} data - Los datos complementarios para la ejecucion
   */
  const verifyAction = async (mode: string, data: object) => {
    setLoading(true)
    try {
      await verifyActionRequest(mode, data).then(async () => await logout())
      Success({
        title: `Exito al ${mode !== 'verifyEmail' ? 'restabler contraseña' : 'verificar email'}`,
        message: "La solicitud se ha completado"
      })
    } catch (e: unknown) {
      isAxiosResponse(e) &&
        Error({ title: "Error en la solicitud", message: e.response.data.message })
    } finally { setStatus() }
  }
  /*---------------------------------------------------------------------------------------------------------*/
  /**
   * Actualiza el estado de autenticación basado en la respuesta del servidor.
   * @param {AxiosResponse | undefined} res - La respuesta del servidor.
   */
  const setStatus = (res?: AxiosResponse) => {
    setIsAuth(Boolean(res?.data))
    setUser(res?.data ?? {})
    setLoading(false)
  }

  return (
    <Auth.Provider value={{ isAuth, user, loading, signin, signup, logout, verifyAction }}>
      {children}
    </Auth.Provider>
  )
}