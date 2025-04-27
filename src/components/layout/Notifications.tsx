import { Bell, X, Loader2, Info, AlertTriangle, CreditCard, TrendingUp, Gift, FileText, Clock, CheckCircle2 } from "lucide-react"
import { useNotificationContext } from "@/context/NotificationContext"
import { Card, CardContent, CardHeader, CardTitle } from "#/ui/card"
import { ThemeContextProps } from "@/interfaces/context.interface"
import { formatDate } from '@/constants/format.constants'
import { useState, useRef, useEffect } from "react"
import { useIsMobile } from "@/hooks/ui/use-mobile"
import { ScrollArea } from "#/ui/scroll-area"
import { Button } from "#/ui/button"
import { MouseEvent } from 'react'
import { cn } from "@/lib/utils"

export function Notifications({ theme }: ThemeContextProps) {
  const { notifications, unreadCount, loading, markAsRead, markAllAsRead, deleteNotification, handleNotificationClick, fetchNotifications, fetchUnreadCount } = useNotificationContext()
  const [isOpen, setIsOpen] = useState(false)
  const hasLoadedRef = useRef(false)
  const isMobile = useIsMobile()
  //load unread count and notifications on mount
  useEffect(() => { if (!hasLoadedRef.current) { fetchUnreadCount(); fetchNotifications(); hasLoadedRef.current = true } }, [fetchUnreadCount, fetchNotifications])
  return (
    <div className="relative">
      <Button
        size="icon"
        variant="ghost"
        aria-label="Notifications"
        onClick={() => { !isOpen && fetchNotifications(); setIsOpen(!isOpen) }}
        className={cn('relative rounded-full transition-colors duration-300', theme === 'dark'
          ? 'bg-zinc-700/40 text-yellow-700 hover:bg-zinc-600'
          : 'bg-gray-100 text-yellow-600 hover:bg-gray-200'
        )}
      >
        <Bell className="h-5 w-5 md:h-6 md:w-6" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 flex items-center justify-center min-w-[18px] h-[18px] text-[10px] font-bold bg-red-500 text-white rounded-full px-1">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </Button>
      {isOpen && (
        <Card className={cn('absolute mt-2 w-96 z-50', isMobile ? 'right-[-50px]' : 'right-0')}>
          <CardHeader className={cn("flex flex-row pb-2", "space-y-0 items-center justify-between", isMobile ? 'p-2' : 'p-4')}>
            <div className="flex items-center justify-between w-full">
              <CardTitle className="text-sm font-medium">Notificaciones</CardTitle>
              <div className="flex space-x-2">
                {unreadCount > 0 && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => markAllAsRead()}
                    className="text-xs h-8"
                  >
                    Marcar todas como leídas
                  </Button>
                )}
                <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} aria-label="Cerrar notificaciones">
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className={cn(isMobile ? 'p-2' : 'p-4')}>
            <ScrollArea className="h-[400px]">
              {loading ? (
                <div className="flex justify-center items-center h-40">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : notifications.length > 0 ? (
                notifications.map((notification) => (
                  <NotificationItem
                    id={notification._id}
                    key={notification._id}
                    url={notification.url}
                    title={notification.title}
                    isRead={notification.isRead}
                    date={notification.createdAt}
                    message={notification.message}
                    type={notification.type || 'default'}
                    onMarkAsRead={markAsRead}
                    onDelete={deleteNotification}
                    onClick={handleNotificationClick}
                  />
                ))
              ) : (
                <div className="flex flex-col items-center justify-center h-40 text-center">
                  <Bell className="h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">No tienes notificaciones</p>
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
/*---------------------------------------------------------------------------------------------------------*/

/*--------------------------------------------------items--------------------------------------------------*/
export interface NotificationItemProps {
  onClick?: (id: string, url?: string) => void
  onMarkAsRead?: (id: string) => void
  onDelete?: (id: string) => void
  type: keyof typeof iconMap | string
  date: Date | string
  message: string
  isRead: boolean
  title: string
  url?: string
  id: string
}

const NotificationItem = ({
  type = 'default',
  message,
  isRead,
  title,
  date,
  url,
  id,
  onClick,
  onDelete,
  onMarkAsRead,
}: NotificationItemProps) => {
  const IconComponent = iconMap[type as keyof typeof iconMap] || iconMap.default
  const color = colorMap[type as keyof typeof colorMap] || colorMap.default
  const handleClick = () => { if (onClick) onClick(id, url) }
  const handleDelete = (e: MouseEvent<HTMLButtonElement>) => { e.stopPropagation(); if (onDelete) onDelete(id) }
  const handleMarkAsRead = (e: MouseEvent<HTMLButtonElement>) => { e.stopPropagation(); if (onMarkAsRead) onMarkAsRead(id) }
  return (
    <Card
      onClick={handleClick}
      className={cn("mb-4 last:mb-0 border shadow-sm transition-all duration-200 cursor-pointer hover:shadow-md",
        isRead ? "" : `border-l-${color.split('-')[1]}-500`,
        isRead ? "opacity-70" : "border-l-4"
      )}
    >
      <CardContent className="p-3">
        <div className="flex items-start space-x-4">
          <div className={`${color} p-2 rounded-full bg-opacity-10`}>
            <IconComponent className={`h-5 w-5 ${color}`} />
          </div>
          <div className="flex-1 space-y-1">
            <div className="flex justify-between items-start">
              <p className={cn("text-sm font-medium leading-none", !isRead && "font-semibold")}>{title}</p>
              <div className="flex space-x-1">
                {!isRead && onMarkAsRead && (
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-6 w-6"
                    onClick={handleMarkAsRead}
                    title="Marcar como leída"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                  </Button>
                )}
                {onDelete && (
                  <Button
                    size="icon"
                    variant="ghost"
                    title="Eliminar"
                    onClick={handleDelete}
                    className="h-6 w-6 text-red-500 hover:text-red-700"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
            <p className="text-sm text-muted-foreground">{message}</p>
            <p className="text-xs text-muted-foreground">{formatDate(date)}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
/*---------------------------------------------------------------------------------------------------------*/

/*--------------------------------------------------tools--------------------------------------------------*/
// Mapa de iconos según el tipo de notificación
const iconMap = {
  completed: CheckCircle2,
  alert: AlertTriangle,
  payment: CreditCard,
  success: TrendingUp,
  document: FileText,
  reminder: Clock,
  default: Bell,
  offer: Gift,
  info: Info,
}

// Mapa de colores según el tipo de notificación
const colorMap = {
  info: "text-blue-500",
  alert: "text-yellow-500",
  payment: "text-red-500",
  success: "text-green-500",
  offer: "text-purple-500",
  document: "text-orange-500",
  reminder: "text-cyan-500",
  completed: "text-emerald-500",
  default: "text-gray-500"
}