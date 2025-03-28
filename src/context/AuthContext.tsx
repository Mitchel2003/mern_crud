import { Props, QueryOptions } from "@/interfaces/props.interface";
import { AuthContext, User } from "@/interfaces/context.interface";
import { useNotification } from "@/hooks/ui/useNotification";
import { isAxiosResponse } from "@/interfaces/db.interface";
import { useLoading } from "@/hooks/ui/useLoading";
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
  if (!context) throw new Error('useAuth must be used within a AuthProvider')
  return context
}

/**
 * Proveedor del contexto de autenticación.
 * Maneja el estado de autenticación y proporciona funciones para iniciar sesión, registrarse y cerrar sesión.
 * @param {Props} props - Las propiedades del componente.
 * @returns {JSX.Element} Elemento JSX que envuelve a los hijos con el contexto de autenticación.
 */
export const AuthProvider = ({ children }: Props): JSX.Element => {
  const { notifySuccess, notifyError } = useNotification()
  const [user, setUser] = useState<User | undefined>(undefined)
  const [loading, setLoading] = useState(true)
  const [isAuth, setIsAuth] = useState(false)
  const { handler } = useLoading()

  useEffect(() => { verifyAuth() }, [])
  /*--------------------------------------------------authentication--------------------------------------------------*/
  /**
   * Inicia sesión con las credenciales del usuario.
   * @param {object} credentials - Las credenciales del usuario.
   * @returns {Promise<any>} Los datos del usuario autenticado.
   */
  const login = async (credentials: object): Promise<any> => {
    return handler('Iniciando sesión...', async () => {
      try {
        const res = await useApi('login').create(credentials)
        notifySuccess({ title: "¡Bienvenido!", message: "Has iniciado sesión correctamente" })
        setAuthStatus(res)
        return res
      } catch (e: unknown) {
        isAxiosResponse(e) && notifyError({ title: "Error al iniciar sesión", message: e.response.data.message })
        setAuthStatus()
        return undefined
      }
    })
  }
  /**
   * Cierra la sesión del usuario actual
   * permite cerrar el user.current de firebase/auth
   */
  const logout = async (): Promise<void> => {
    return handler('Cerrando sesión...', async () => {
      try {
        await useApi('logout').void().finally(() => setAuthStatus())
        notifySuccess({ title: "Sesión cerrada", message: "Has cerrado sesión correctamente" })
      } catch (e: unknown) { isAxiosResponse(e) && notifyError({ title: "Error al cerrar sesión", message: e.response.data.message }) }
    })
  }
  /*---------------------------------------------------------------------------------------------------------*/

  /*--------------------------------------------------user handlers--------------------------------------------------*/
  /**
   * Obtiene todos los usuarios de un tipo específico
   * @returns {Promise<any[]>} Un array con los datos de todos los usuarios.
   */
  const getAll = async (): Promise<any[]> => {
    try { return (await useApi('user').getAll()).data }
    catch (e: unknown) {
      isAxiosResponse(e) && notifyError({ title: "Error al obtener lista", message: e.response.data.message })
      return []
    }
  }
  /**
   * Obtiene un usuario específico por su ID
   * @param {string} id - El ID del usuario.
   * @returns {Promise<any>} Los datos del usuario.
   */
  const getById = async (id: string): Promise<any | undefined> => {
    try { return (await useApi('user').getById(id)).data }
    catch (e: unknown) {
      isAxiosResponse(e) && notifyError({ title: "Error al obtener datos", message: e.response.data.message })
      return undefined
    }
  }
  /**
   * Obtiene todos los usuarios de un tipo específico por una consulta
   * @param {QueryOptions} query - Corresponde a la consulta, alucivo a un criterio de busqueda.
   * @returns {Promise<any[]>} Un array con los datos de todos los usuarios.
   */
  const getByQuery = async (query: QueryOptions): Promise<any[]> => {
    try {
      if ('enabled' in query && query.enabled === false) return []
      return (await useApi('user').getByQuery({ ...query, enabled: undefined })).data
    } catch (e: unknown) {
      isAxiosResponse(e) && notifyError({ title: "Error al obtener lista", message: e.response.data.message })
      return []
    }
  }
  /**
   * Registra un nuevo usuario con los datos proporcionados.
   * @param {object} data - Los datos del nuevo usuario.
   * @returns {Promise<any>} Los datos del usuario registrado.
   */
  const create = async (data: object): Promise<any> => {
    return handler('Registrando usuario...', async () => {
      try {
        const res = await useApi('user').create(data)
        notifySuccess({ title: "¡Registro exitoso!", message: "Hemos enviado un correo de verificación a tu cuenta, tienes 15 minutos para confirmarlo" })
        setAuthStatus(res)
        return res.data
      } catch (e: unknown) {
        isAxiosResponse(e) && notifyError({ title: "Error en el registro", message: e.response.data.message })
        setAuthStatus()
        return undefined
      }
    })
  }
  /**
   * Actualiza un usuario existente
   * @param {string} id - El ID del usuario.
   * @param {object} data - Los datos del usuario.
   * @returns {Promise<any>} Los datos del usuario actualizado.
   */
  const update = async (id: string, data: object): Promise<any> => {
    return handler('Actualizando...', async () => {
      try {
        const response = await useApi('user').update(id, data)
        notifySuccess({ title: "Éxito", message: "Registro actualizado correctamente" })
        return response.data
      } catch (e: unknown) {
        isAxiosResponse(e) && notifyError({ title: "Error al actualizar", message: e.response.data.message })
        return undefined
      }
    })
  }
  /**
   * Elimina la cuenta del usuario actual en Firebase Auth, pide la confirmación de la contraseña
   * Esta operación es irreversible y elimina el usuario de Firebase
   */
  const _delete = async (id: string): Promise<void> => {
    return handler('Eliminando cuenta...', async () => {
      try {
        await useApi('user').delete(id)
        notifySuccess({ title: "Cuenta eliminada", message: "Tu cuenta ha sido eliminada permanentemente" })
      } catch (e: unknown) { isAxiosResponse(e) && notifyError({ title: "Error al eliminar cuenta", message: e.response.data.message }) }
    })
  }
  /*---------------------------------------------------------------------------------------------------------*/

  /*--------------------------------------------------verification--------------------------------------------------*/
  /**
   * Permite enviar una solicitud de restablecimiento de contraseña
   * @param {string} email - Corresponde al email para enviar la solicitud.
   */
  const sendResetPassword = async (email: string): Promise<void> => {
    return handler('Validando solicitud...', async () => {
      try {
        await useApi('forgot-password').void({ email })
        notifySuccess({ title: "Exito al enviar solicitud de restablecimiento de contraseña", message: "La solicitud se ha completado" })
      } catch (e: unknown) { isAxiosResponse(e) && notifyError({ title: "Error al enviar solicitud de restablecimiento de contraseña", message: e.response.data.message }) }
    })
  }
  /*---------------------------------------------------------------------------------------------------------*/

  /*--------------------------------------------------helpers--------------------------------------------------*/
  /**
   * Actualiza el estado de autenticación basado en la respuesta del servidor.
   * @param {AxiosResponse | undefined} res - La respuesta del servidor.
   */
  const setAuthStatus = (res?: AxiosResponse) => {
    setUser(res?.data ?? undefined)
    setIsAuth(Boolean(res?.data))
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
      isAxiosResponse(e) && notifyError({ title: "Error solicitud de verificación", message: e.response.data.message })
      setAuthStatus()
    } finally { setLoading(false) }
  }
  /*---------------------------------------------------------------------------------------------------------*/
  return (
    <Auth.Provider value={{ isAuth, user, loading, login, logout, getAll, getById, getByQuery, create, update, delete: _delete, sendResetPassword }}>
      {children}
    </Auth.Provider>
  )
}