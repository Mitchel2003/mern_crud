import { login as loginFB, logout as logoutFB, forgotPassword, getCurrentUser, subscribeAuthChanges } from "@/controllers/auth.controller"
import { getTokenMessaging, listenMessages } from "@/controllers/messaging.controller"
import { LoginFormProps, UserFormProps } from "@/schemas/auth/auth.schema"
import { AuthContext, User } from "@/interfaces/context.interface"
import { useNotification } from "@/hooks/ui/useNotification"
import { QueryOptions } from "@/interfaces/hook.interface"
import { Props } from "@/interfaces/props.interface"
import { useLoading } from "@/hooks/ui/useLoading"
import { txt } from "@/constants/format.constants"
import { useApi } from "@/api/handler"
import { NotFound } from "@/errors"

import { createContext, useContext, useEffect, useState, useRef } from "react"
import { Unsubscribe } from "firebase/auth"
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
  const { notifySuccess, notifyWarning, notifyError, notifyInfo } = useNotification()
  const unsubscribe = useRef<(() => void) | null>(null)
  const messaging = useRef<Unsubscribe | null>(null)
  const [user, setUser] = useState<User | undefined>()
  const [loading, setLoading] = useState(true)
  const [isAuth, setIsAuth] = useState(false)
  const { handler } = useLoading()

  useEffect(() => { //This effect runs once time
    initializeAuth() //Initialize handler authentication
    unsubscribe.current = subscribeAuthChanges((firebaseUser) => {
      const lastSignInTime = firebaseUser?.metadata?.lastSignInTime
      if (firebaseUser) { getUser(firebaseUser.uid, lastSignInTime) }
      else { setAuthStatus(); setLoading(false) }
    }) //Add listeners events (token-expired, token-expiring)
    window.addEventListener('token-expired', handleTokenExpired)
    window.addEventListener('token-expiring', handleTokenExpiring)
    return () => { //unmount listeners and unsubscribe handlers
      window.removeEventListener('token-expired', handleTokenExpired)
      window.removeEventListener('token-expiring', handleTokenExpiring)
      if (messaging.current) { messaging.current(); messaging.current = null }
      if (unsubscribe.current) { unsubscribe.current(); unsubscribe.current = null }
    }
  }, [])

  /** Handle message listener when user changes */
  useEffect(() => { if (user) setupMessageListener() }, [user])
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
        if (!user?.data) throw new NotFound({ message: 'usuario' })
        await updateTokenMessaging(user.data) //handle messaging
        notifyInfo(txt('login'))
        setAuthStatus(user)
      } catch (e) { notifyError(txt('login', e)); setAuthStatus() }
    })
  }
  /**
   * Cierra la sesión del usuario actual
   * permite cerrar el user.current de firebase/auth
   */
  const logout = async (): Promise<void> => {
    return handler('Cerrando sesión...', async () => {
      try { await logoutFB().finally(() => setAuthStatus()) }
      catch (e) { notifyError(txt('logout', e)); setAuthStatus() }
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
    catch (e) { notifyError(txt('getAllUser', e)); return [] }
  }
  /**
   * Obtiene un usuario específico por su ID
   * @param {string} id - El ID del usuario.
   * @returns {Promise<any | undefined>} Los datos del usuario o undefined.
   */
  const getById = async (id: string): Promise<any | undefined> => {
    try { return (await useApi('user').getById(id)).data }
    catch (e) { notifyError(txt('getUserById', e)); return undefined }
  }
  /**
   * Obtiene todos los usuarios de un tipo específico por una consulta
   * @param {QueryOptions} query - Corresponde a la consulta, alucivo a un criterio de busqueda.
   * @returns {Promise<any[]>} Un array con los datos de todos los usuarios o un array vacío.
   */
  const getByQuery = async (query: QueryOptions): Promise<any[]> => {
    try { return (await useApi('user').getByQuery(query)).data }
    catch (e) { notifyError(txt('getUserByQuery', e)); return [] }
  }
  /**
   * Registra un nuevo usuario (auth) con los datos proporcionados.
   * Seguido, procede a registrar el usuario en la base de datos (MongoDB).
   * @param {object} data - Los datos del nuevo usuario, contiene email and password
   * @returns {Promise<any>} Los datos del usuario registrado o undefined.
   */
  const create = async (data: UserFormProps): Promise<any> => {
    return handler('Registrando usuario...', async () => {
      try {
        const response = await useApi('user').create(data)
        notifySuccess(txt('createUser'))
        return response.data
      } catch (e) { notifyError(txt('createUser', e)) }
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
        notifySuccess(txt('updateUser'))
        return response.data
      } catch (e) { notifyError(txt('updateUser', e)) }
    })
  }
  /**
   * Elimina la cuenta del usuario
   * @param {string} id - El ID del usuario.
   * @returns {Promise<any>} Los datos del usuario eliminado o undefined.
   */
  const _delete = async (id: string): Promise<any> => {
    return handler('Eliminando cuenta...', async () => {
      try {
        const response = await useApi('user').delete(id)
        notifySuccess(txt('deleteUser'))
        return response.data
      } catch (e) { notifyError(txt('deleteUser', e)) }
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
      try { await forgotPassword(email).then(() => notifyInfo(txt('send-reset-pass'))) }
      catch (e) { notifyError(txt('send-reset-pass', e)) }
    })
  }
  /**
   * Envia un mensaje de notificacion al usuario.
   * @param {object} data - Contiene el ID del usuario y el título y el mensaje de la notificación.
   */
  const sendNotification = async (data: object): Promise<void> => {
    try { await useApi('fcm').void(data) } //send notification push
    catch (e) { notifyError(txt('send-notification', e)) }
  }
  /**
   * Nos permite guardar el token de Firebase Cloud Messaging (FCM) en el usuario.
   * @param {User} user - Corresponde a las creaciones del usuario.
   */
  const updateTokenMessaging = async (user: User): Promise<void> => {
    try {
      const permission = await Notification.requestPermission()
      if (permission !== "granted") return; //to allow messages
      const token: string = await getTokenMessaging() //fcm token
      if (token === user.fcmToken) return; //to avoid unnecessary      
      await useApi('user').update(user._id, { fcmToken: token })
    } catch (e) { notifyError(txt('update-token-messaging', e)) }
  }
  /*---------------------------------------------------------------------------------------------------------*/

  /*--------------------------------------------------helpers--------------------------------------------------*/
  /**
   * Actualiza el estado de autenticación basado en la respuesta del servidor.
   * @param {AxiosResponse | undefined} res - La respuesta del servidor.
   */
  const setAuthStatus = (res?: AxiosResponse, config?: any) => {
    if (!res?.data) localStorage.removeItem('uid') //remove local uid
    setUser(res?.data ? { ...res.data, ...config } : undefined)
    setIsAuth(Boolean(res?.data))
  }
  /**
   * Inicializa el estado de autenticación
   * Chequea el token y uid en localStorage,
   * o el current user de Firebase Authentication
   */
  const initializeAuth = async () => {
    const token = localStorage.getItem('token')
    const storedUid = localStorage.getItem('uid')
    if (token && storedUid) await getUser(storedUid)
    else { //If no token or uid, check current user
      const initialUser = getCurrentUser() //this.auth
      if (initialUser) await getUser(initialUser.uid)
      else { setAuthStatus(); setLoading(false) }
    }
  }
  /**
   * Obtiene los datos del usuario desde la base de datos
   * @param {string} uid - ID del usuario en Firebase
   * @param {string} lastSignInTime - Fecha de la última sesión del usuario
   */
  const getUser = async (uid: string, lastSignInTime?: string) => {
    try {
      const res = await useApi('user').getById(uid)
      res?.data && localStorage.setItem('uid', uid)
      setAuthStatus(res, { lastSignInTime }) //set local status
    } catch (e) { notifyError(txt('getUserById', e)); setAuthStatus() }
    finally { setLoading(false) }
  }
  /*---------------------------------------------------------------------------------------------------------*/

  /*--------------------------------------------------tools--------------------------------------------------*/
  /** Configura un listener para recibir mensajes en primer plano */
  const setupMessageListener = async () => {
    try { messaging.current = await listenMessages(() => notifyWarning(txt('setup-messaging-listener'))) }
    catch (e) { notifyError(txt('setup-messaging-listener', e)) }
  }
  /** Handle token expired (not renewable) */
  const handleTokenExpired = async () => { notifyWarning(txt('expired-token')); await logout() }
  /** Handle token expiring (renewable) */
  const handleTokenExpiring = async () => {
    const auth = getCurrentUser() //current user from firebase
    if (auth) { const token = await auth.getIdToken(true); localStorage.setItem('token', token) }
  }
  /*---------------------------------------------------------------------------------------------------------*/

  /*--------------------------------------------------returns--------------------------------------------------*/
  return (
    <Auth.Provider value={{
      isAuth, user, loading, login, logout, getAll, getById, getByQuery,
      create, update, delete: _delete, sendResetPassword, sendNotification
    }}>
      {children}
    </Auth.Provider>
  )
}