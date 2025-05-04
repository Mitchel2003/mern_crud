import { CollaboratorDashboardData } from "@/features/dashboard/hooks/useCollaboratorDashboard"
import { Bell, Info, AlertTriangle, AlertCircle } from "lucide-react"
import { ThemeContextProps } from "@/interfaces/context.interface"
import { format, parseISO } from "date-fns"
import { es } from "date-fns/locale"
import { cn } from "@/lib/utils"

interface NotificationsSectionProps extends ThemeContextProps {
  data: CollaboratorDashboardData
}

const NotificationsSection = ({ theme, data }: NotificationsSectionProps) => {
  const unreadCount = data.notifications.filter(n => !n.read).length

  return (
    <section className={cn('p-6 rounded-lg shadow-sm border', theme === 'dark' ? 'bg-zinc-950 border-zinc-700' : 'bg-white border-gray-100')}>
      <div className="flex items-center justify-between mb-4">
        <h2 className={cn('text-lg font-medium flex items-center', theme === 'dark' ? 'text-white' : 'text-gray-900')}>
          <Bell className="h-5 w-5 mr-2" />
          Notificaciones
          {unreadCount > 0 && (
            <span className="ml-2 px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 rounded-full">
              {unreadCount} nuevas
            </span>
          )}
        </h2>
        <button className={cn('text-sm', theme === 'dark' ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-500')}>
          Marcar todas como leídas
        </button>
      </div>

      <div className="space-y-3">
        {data.notifications.map((notification) => (
          <NotificationCard key={notification.id} notification={notification} theme={theme} />
        ))}
        {data.notifications.length === 0 && (
          <p className={cn('text-sm', theme === 'dark' ? 'text-gray-400' : 'text-gray-500')}>
            No hay notificaciones para mostrar.
          </p>
        )}
      </div>
    </section>
  )
}

export default NotificationsSection
/*---------------------------------------------------------------------------------------------------------*/

/*--------------------------------------------------tools--------------------------------------------------*/
interface NotificationCardProps extends ThemeContextProps {
  notification: CollaboratorDashboardData['notifications'][0]
}

function NotificationCard({ notification, theme }: NotificationCardProps) {
  const typeIcons = {
    info: <Info className="h-5 w-5 text-blue-500" />,
    warning: <AlertTriangle className="h-5 w-5 text-amber-500" />,
    urgent: <AlertCircle className="h-5 w-5 text-red-500" />
  }

  const typeColors = {
    info: theme === 'dark' ? 'border-blue-800 bg-blue-900/20' : 'border-blue-200 bg-blue-50',
    warning: theme === 'dark' ? 'border-amber-800 bg-amber-900/20' : 'border-amber-200 bg-amber-50',
    urgent: theme === 'dark' ? 'border-red-800 bg-red-900/20' : 'border-red-200 bg-red-50'
  }

  const formattedTime = format(parseISO(notification.date), 'p', { locale: es })

  return (
    <div className={cn('p-3 rounded-lg border flex items-start',
      typeColors[notification.type as keyof typeof typeColors],
      notification.read ? 'opacity-70' : 'opacity-100'
    )}>
      <div className="mr-3 mt-0.5">
        {typeIcons[notification.type as keyof typeof typeIcons]}
      </div>
      <div className="flex-1">
        <p className={cn('text-sm', theme === 'dark' ? 'text-white' : 'text-gray-900')}>
          {notification.message}
        </p>
        <div className="mt-1 flex items-center justify-between">
          <span className={cn('text-xs', theme === 'dark' ? 'text-gray-400' : 'text-gray-500')}>
            {formattedTime}
          </span>
          {!notification.read && (
            <span className="text-xs font-medium text-blue-600 dark:text-blue-400">
              Nueva
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
