import { NotificationContext, NotificationType, CreateNotificationProps } from '@/interfaces/context.interface'
import { useState, useCallback, useRef, useEffect } from 'react'
import { useNotification } from '@/hooks/ui/useNotification'
import { formatError } from '@/constants/format.constants'
import { Props } from '@/interfaces/props.interface'
import { useApi } from '@/api/handler'

import { createContext, useContext } from "react"

const Notification = createContext<NotificationContext>(undefined)

/**
 * Hook personalizado para acceder al contexto de notificaciones.
 * @throws {Error} Si se intenta usar fuera del NotificationProvider.
 */
export const useNotificationContext = () => {
  const context = useContext(Notification)
  if (!context) throw new Error('useNotificationContext must be used within a NotificationProvider')
  return context
}

/**
 * Proveedor del contexto de notificaciones.
 * Maneja el estado de las notificaciones y proporciona funciones para interactuar con ellas.
 * @param {Props} props - Las propiedades del componente.
 * @returns {JSX.Element} Elemento JSX que envuelve a los hijos con el contexto de notificaciones.
 */
export const NotificationProvider = ({ children }: Props): JSX.Element => {
  const [notifications, setNotifications] = useState<NotificationType[]>([])
  const [initialized, setInitialized] = useState<boolean>(false)
  const [unreadCount, setUnreadCount] = useState<number>(0)
  const [loading, setLoading] = useState<boolean>(false)
  const pollingRef = useRef<NodeJS.Timeout | null>(null)
  const { notifyError, notifySuccess } = useNotification()

  /** Obtain the notifications unread count of this user context */
  const fetchUnreadCount = useCallback(async (showError = false) => {
    try { await useApi('notifications/unread/count').get().then((res: any) => setUnreadCount(res.data.count || 0)) }
    catch (e) { showError && notifyError({ message: formatError(e) }) }
  }, [notifyError])

  useEffect(() => { //Only initialize once
    if (!initialized) { //Get unread count on start
      fetchUnreadCount(false); setInitialized(true)
      pollingRef.current = setInterval(() => { fetchUnreadCount(false) }, 60000)
    } //Cleanup on unmount
    return () => { if (pollingRef.current) { clearInterval(pollingRef.current); pollingRef.current = null } }
  }, [initialized, fetchUnreadCount])
  /*---------------------------------------------------------------------------------------------------------*/

  /*--------------------------------------------------handlers--------------------------------------------------*/
  /**
   * Crea una nueva notificación genérica
   * @param {CreateNotificationProps} data - Datos de la notificación
   * @throws {Error} Si ocurre un error al crear la notificación
   */
  const createNotification = useCallback(async (data: CreateNotificationProps) => {
    try { await useApi('notifications/create').void(data).then(() => fetchUnreadCount(false)) }
    catch (e: unknown) { notifyError({ message: formatError(e) }) }
  }, [notifyError, fetchUnreadCount])
  /**
   * Marca una notificación como leída
   * @param {string} id - El ID de la notificación
   */
  const markAsRead = useCallback(async (id: string) => {
    try {
      await useApi('notifications/read').update(id, {})
      setNotifications(prev => prev.map(notif => notif._id === id ? { ...notif, isRead: true } : notif))
      setUnreadCount(prev => Math.max(0, prev - 1)) //Update unread count
    } catch (e: unknown) { notifyError({ message: formatError(e) }) }
  }, [notifyError])
  /**
   * Marca todas las notificaciones como leídas
   * @throws {Error} Si ocurre un error al marcar las notificaciones
   */
  const markAllAsRead = useCallback(async () => {
    try {
      await useApi('notifications/read/all').void({})
      setNotifications(prev => prev.map(notif => ({ ...notif, isRead: true })))
      setUnreadCount(0) //Update unread count
      notifySuccess({ message: 'Notificaciones marcadas como leídas' })
    } catch (e: unknown) { notifyError({ message: formatError(e) }) }
  }, [notifyError, notifySuccess])
  /**
   * Elimina una notificación
   * @param {string} id - El ID de la notificación
   * @throws {Error} Si ocurre un error al eliminar la notificación
   */
  const deleteNotification = useCallback(async (id: string) => {
    try {
      await useApi('notifications').delete(id)
      setNotifications(prev => prev.filter(notif => notif._id !== id))
      const wasUnread = notifications.find(n => n._id === id && !n.isRead)
      if (wasUnread) setUnreadCount(prev => Math.max(0, prev - 1))
      notifySuccess({ message: 'Notificación eliminada' })
    } catch (e: unknown) { notifyError({ message: formatError(e) }) }
  }, [notifications, notifyError, notifySuccess])
  /**
   * Elimina todas las notificaciones
   * @throws {Error} Si ocurre un error al eliminar las notificaciones
   */
  const deleteAllNotifications = useCallback(async () => {
    try {
      await useApi('notifications').remove()
      setNotifications([]) //Update local notifications
      setUnreadCount(0) //Update unread count
      notifySuccess({ message: 'Todas las notificaciones eliminadas' })
    } catch (e: unknown) { notifyError({ message: formatError(e) }) }
  }, [notifyError, notifySuccess])
  /*---------------------------------------------------------------------------------------------------------*/

  /*--------------------------------------------------tools--------------------------------------------------*/
  /**
   * Handle notification click
   * @param {string} id - The notification ID
   * @param {string} url - Optional URL to open
   */
  const handleNotificationClick = useCallback((id: string, url?: string) => {
    markAsRead(id) //Mark as read
    if (url) window.open(url, '_blank')
  }, [markAsRead])

  /**
   * Obtain the number of unread notifications that match a URL pattern
   * @param {string} path - The URL pattern to search (e.g: 'solicit', 'curriculum')
   * @returns {number} - The number of unread notifications that match the pattern
   */
  const getNotificationCount = useCallback((path: string): number => {
    if (path.length === 0) return 0 //If no path, means represent a collapsible item
    if (!notifications || notifications.length === 0) return 0 //If no notifications
    return notifications.filter(notification => !notification.isRead && notification?.url?.includes(path)).length
  }, [notifications])

  /**
   * Fetch notifications
   * @param {boolean} showLoading - Whether to show loading state
   * @throws {Error} If an error occurs during the fetch
   */
  const fetchNotifications = useCallback(async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true)
      const response = await useApi('notifications').get()
      if (response?.data) setNotifications(response.data.notifications || [])
    } catch (e) { showLoading && notifyError({ message: formatError(e) }) }
    finally { if (showLoading) setLoading(false) }
  }, [notifyError])
  /*---------------------------------------------------------------------------------------------------------*/

  /*--------------------------------------------------returns--------------------------------------------------*/
  return (
    <Notification.Provider value={{
      getNotificationCount,
      fetchNotifications,
      fetchUnreadCount,
      notifications,
      unreadCount,
      loading,
      markAsRead,
      markAllAsRead,
      deleteNotification,
      deleteAllNotifications,
      handleNotificationClick,
      createNotification
    }}>
      {children}
    </Notification.Provider>
  )
}