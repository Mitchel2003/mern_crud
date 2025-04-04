import { login as loginFB, logout as logoutFB, signin, forgotPassword, getCurrentUser, subscribeAuthChanges } from "@/controllers/auth.controller"
import { getTokenMessaging } from "@/controllers/messaging.controller"
import { Props, QueryOptions } from "@/interfaces/props.interface"
import { AuthContext, User } from "@/interfaces/context.interface"
import { useNotification } from "@/hooks/ui/useNotification"
import { isAxiosResponse } from "@/interfaces/db.interface"
import { LoginFormProps } from "@/schemas/auth/auth.schema"
import { useLoading } from "@/hooks/ui/useLoading"
import { useApi } from "@/api/handler"

import { createContext, useContext, useEffect, useState, useRef } from "react"
import { AxiosResponse } from "axios"

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
  const unsubscribe = useRef<(() => void) | null>(null)
  const [user, setUser] = useState<User | undefined>()
  const [loading, setLoading] = useState(true)
  const [isAuth, setIsAuth] = useState(false)
  const { handler } = useLoading()

  useEffect(() => {// To subscribe authentication state
    const initialUser = getCurrentUser()// Get initial state
    if (initialUser) { getUser(initialUser.uid) }
    else { setAuthStatus(); setLoading(false) }
    // Subscribe to authentication changes on mount
    unsubscribe.current = subscribeAuthChanges((firebaseUser) => {
      if (firebaseUser) { getUser(firebaseUser.uid) }
      else { setAuthStatus(); setLoading(false) }
    })// Clean up subscription on unmount
    return () => { if (unsubscribe.current) { unsubscribe.current(); unsubscribe.current = null } }
  }, [])
  /*--------------------------------------------------authentication--------------------------------------------------*/
  /**
   * Inicia sesión con las credenciales del usuario.
   * @param {LoginFormProps} data - Las credenciales del usuario.
   */
  const login = async (data: LoginFormProps): Promise<void> => {
    return handler('Iniciando sesión...', async () => {
      try {
        const res = await loginFB(data.email, data.password)
        const user = await useApi('user').getById(res.uid)
        if (!user?.data) throw new Error('No se encontro el usuario')
        await updateTokenMessaging(user.data._id)// handle messaging token
        notifySuccess({ title: "¡Bienvenido!", message: "Has iniciado sesión" })
        setAuthStatus(user)
      } catch (e: unknown) {
        isAxiosResponse(e) && notifyError({ title: "Error al iniciar sesión", message: e.response.data.message })
        setAuthStatus()
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
        await logoutFB()
        setAuthStatus()
        notifySuccess({ title: "Sesión cerrada", message: "Has cerrado sesión correctamente" })
      } catch (e: unknown) {
        isAxiosResponse(e) && notifyError({ title: "Error al cerrar sesión", message: e.response.data.message })
        setAuthStatus()
      }
    })
  }
  /*---------------------------------------------------------------------------------------------------------*/

  /*--------------------------------------------------user handlers--------------------------------------------------*/
  /**
   * Obtiene todos los usuarios de un tipo específico
   * @returns {Promise<any[]>} Un array con los datos de todos los usuarios o un array vacío.
   */
  const getAll = async (): Promise<any[]> => {
    try { return (await useApi('user').getAll()).data }
    catch (e) { isAxiosResponse(e) && notifyError({ title: "Error al obtener lista", message: e.response.data.message }); return [] }
  }
  /**
   * Obtiene un usuario específico por su ID
   * @param {string} id - El ID del usuario.
   * @returns {Promise<any | undefined>} Los datos del usuario o undefined.
   */
  const getById = async (id: string): Promise<any | undefined> => {
    try { return (await useApi('user').getById(id)).data }
    catch (e) { isAxiosResponse(e) && notifyError({ title: "Error al obtener datos", message: e.response.data.message }); return undefined }
  }
  /**
   * Obtiene todos los usuarios de un tipo específico por una consulta
   * @param {QueryOptions} query - Corresponde a la consulta, alucivo a un criterio de busqueda.
   * @returns {Promise<any[]>} Un array con los datos de todos los usuarios o un array vacío.
   */
  const getByQuery = async (query: QueryOptions): Promise<any[]> => {
    try {
      if ('enabled' in query && query.enabled === false) return []
      return (await useApi('user').getByQuery({ ...query, enabled: undefined })).data
    } catch (e) { isAxiosResponse(e) && notifyError({ title: "Error al obtener lista", message: e.response.data.message }); return [] }
  }
  /**
   * Registra un nuevo usuario (auth) con los datos proporcionados.
   * Seguido, procede a registrar el usuario en la base de datos (MongoDB).
   * @param {object} data - Los datos del nuevo usuario, contiene email and password
   * @returns {Promise<any>} Los datos del usuario registrado o undefined.
   */
  const create = async (data: object): Promise<any> => {
    return handler('Registrando usuario...', async () => {
      try {
        const authentication = await signin(data as any)
        const response = await useApi('user').create(authentication)
        notifySuccess({ title: "¡Registro exitoso!", message: "Hemos enviado un correo de verificación a tu cuenta" })
        setAuthStatus(response)
        return response.data
      } catch (e) { isAxiosResponse(e) && notifyError({ title: "Error en el registro", message: e.response.data.message }); setAuthStatus() }
    })
  }
  /**
   * Actualiza un usuario existente
   * @param {string} id - El ID del usuario.
   * @param {object} data - Los datos del usuario.
   * @returns {Promise<any>} Los datos del usuario actualizado o undefined.
   */
  const update = async (id: string, data: object): Promise<any> => {
    return handler('Actualizando...', async () => {
      try {
        const response = await useApi('user').update(id, data)
        notifySuccess({ title: "Éxito", message: "Registro actualizado correctamente" })
        return response.data
      } catch (e) { isAxiosResponse(e) && notifyError({ title: "Error al actualizar", message: e.response.data.message }) }
    })
  }
  /**
   * Elimina la cuenta del usuario actual en Firebase Auth, pide la confirmación de la contraseña
   * Esta operación es irreversible y elimina el usuario de Firebase
   */
  const _delete = async (id: string): Promise<void> => {
    return handler('Eliminando cuenta...', async () => {
      try { await useApi('user').delete(id).then(() => notifySuccess({ title: "Cuenta eliminada", message: "La cuenta ha sido eliminada permanentemente" })) }
      catch (e) { isAxiosResponse(e) && notifyError({ title: "Error al eliminar cuenta", message: e.response.data.message }) }
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
      try { await forgotPassword(email).then(() => notifySuccess({ title: "Exito al enviar solicitud de restablecimiento de contraseña", message: "La solicitud se ha completado" })) }
      catch (e) { isAxiosResponse(e) && notifyError({ title: "Error al enviar solicitud de restablecimiento de contraseña", message: e.response.data.message }) }
    })
  }
  /**
   * Envia un mensaje de notificacion al usuario.
   * @param {object} data - Contiene el ID del usuario y el título y el mensaje de la notificación.
   */
  const sendNotification = async (data: object): Promise<void> => {
    try { await useApi('fcm').void(data).then(() => notifySuccess({ title: "Exito al enviar notificación", message: "La notificación se ha completado" })) }
    catch (e) { isAxiosResponse(e) && notifyError({ title: "Error al enviar notificación", message: e.response.data.message }) }
  }
  /**
   * Nos permite guardar el token de Firebase Cloud Messaging (FCM) en el usuario.
   * @param {string} userId - Corresponde al ID del usuario.
   */
  const updateTokenMessaging = async (userId: string): Promise<void> => {
    try {
      const permission = await Notification.requestPermission()
      if (permission !== "granted") return // to allow messages
      const token: string = await getTokenMessaging()
      const res = (await useApi('user').update(userId, { fcmToken: token })).data
      if (!res) return notifyError({ message: "El token de Cloud Messaging no se ha guardado" })
    } catch (e) { isAxiosResponse(e) && notifyError({ title: "Error al guardar token de Cloud Messaging", message: e.response.data.message }) }
  }
  /*---------------------------------------------------------------------------------------------------------*/

  /*--------------------------------------------------helpers--------------------------------------------------*/
  /**
   * Actualiza el estado de autenticación basado en la respuesta del servidor.
   * @param {AxiosResponse | undefined} res - La respuesta del servidor.
   */
  const setAuthStatus = (res?: AxiosResponse) => {
    setUser(res?.data || undefined)
    setIsAuth(Boolean(res?.data))
  }
  /**
   * Obtiene los datos del usuario desde la base de datos
   * @param {string} uid - ID del usuario en Firebase
   */
  const getUser = async (uid: string) => {
    try { await useApi('user').getById(uid).then((res) => { setAuthStatus(res) }) }
    catch (e) { isAxiosResponse(e) && notifyError({ title: "Error al obtener datos de usuario", message: e.response.data.message }); setAuthStatus() }
    finally { setLoading(false) }
  }
  /*---------------------------------------------------------------------------------------------------------*/
  return (
    <Auth.Provider value={{
      isAuth, user, loading, login, logout, getAll, getById, getByQuery,
      create, update, delete: _delete, sendResetPassword, sendNotification
    }}>
      {children}
    </Auth.Provider>
  )
}