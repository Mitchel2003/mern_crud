import { AuthContext, User } from "@/interfaces/context.interface";
import { isAxiosResponse } from "@/interfaces/response.interface";
import { Props } from "@/interfaces/props.interface";

import { loginRequest, registerRequest, verifyAuthRequest } from "@/api/auth";
import { createContext, useContext, useState, useEffect } from "react";
import { AxiosResponse } from "axios";
import Cookies from "js-cookie";
import { useNotification } from "@/hooks/useNotification"

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
  const { notifySuccess, notifyError, notifyInfo } = useNotification()
  const [errors, setErrors] = useState<string[]>([]);
  const [user, setUser] = useState<User>(undefined);
  const [loading, setLoading] = useState(true);
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => timeAlert(), [errors])
  useEffect(() => { verifyToken() }, [])

  /** Configura un temporizador para limpiar los errores después de 5 segundos */
  const timeAlert = () => {
    if (errors.length === 0) return;
    const timer = setTimeout(() => setErrors([]), 5000);
    return () => clearTimeout(timer);
  }

  /** Verifica el token de autenticación almacenado en las cookies */
  const verifyToken = async () => {
    if (!Cookies.get().token) return setStatus()
    try {
      const res = await verifyAuthRequest();
      setStatus(res);
    } catch (e: unknown) {
      if (isAxiosResponse(e)) {
        notifyError({
          title: "Error de autenticación",
          message: e.response?.message
        })
      }
      setStatus()
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
      notifySuccess({
        title: "¡Bienvenido!",
        message: "Has iniciado sesión correctamente"
      })
    } catch (e: unknown) {
      if (isAxiosResponse(e)) {
        notifyError({
          title: "Error al iniciar sesión",
          message: e.response.message
        })
      }
    } finally { setLoading(false) }
  }

  /**
   * Registra un nuevo usuario con los datos proporcionados.
   * @param {object} data - Los datos del nuevo usuario.
   */
  const signup = async (data: object) => {
    setLoading(true)
    try {
      const res = await registerRequest(data);
      setStatus(res)
      notifySuccess({
        title: "¡Registro exitoso!",
        message: "Tu cuenta ha sido creada correctamente"
      })
    } catch (e: unknown) {
      if (isAxiosResponse(e)) {
        notifyError({
          title: "Error en el registro",
          message: e.response.message
        })
      }
    } finally { setLoading(false) }
  }

  /** Cierra la sesión del usuario actual */
  const logout = () => {
    Cookies.remove('token')
    setStatus()
    notifyInfo({
      title: "Sesión cerrada",
      message: "Has cerrado sesión correctamente"
    })
  }

  /**
   * Actualiza el estado de autenticación basado en la respuesta del servidor.
   * @param {AxiosResponse} [res] - La respuesta del servidor.
   */
  const setStatus = (res?: AxiosResponse) => {
    setIsAuth(Boolean(res?.data))
    setUser(res?.data ?? {})
    setLoading(false)
  }

  return (
    <Auth.Provider value={{ isAuth, user, loading, errors, signin, signup, logout }}>
      {children}
    </Auth.Provider>
  )
}