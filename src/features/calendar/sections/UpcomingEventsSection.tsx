import { Engineering, Groups2, InstallMobile, ManageSearch, Plumbing, ReduceCapacity } from "@mui/icons-material"
import { Calendar, Clock, MapPin, AlertCircle } from "lucide-react"
import { ThemeContextProps } from "@/interfaces/context.interface"
import { format, parseISO } from "date-fns"
import { es } from "date-fns/locale"
import { cn } from "@/lib/utils"

// Definimos los tipos para los datos que devuelve el hook
export interface CalendarEvent {
  type: 'maintenance' | 'inspection' | 'repair' | 'installation' | 'meeting' | 'training'
  priority: 'high' | 'medium' | 'low'
  equipmentName?: string
  clientName?: string
  startDate: string
  location?: string
  endDate: string
  title: string
  id: string
}

interface UpcomingEventsSectionProps extends ThemeContextProps {
  upcomingEvents: CalendarEvent[]
}

const UpcomingEventsSection = ({ theme, upcomingEvents }: UpcomingEventsSectionProps) => {
  return (
    <section className={cn('p-4 rounded-lg shadow-sm border', theme === 'dark'
      ? 'bg-zinc-950 border-zinc-700'
      : 'bg-white border-gray-100'
    )}>
      <h2 className={cn('text-lg font-medium mb-4 flex items-center', theme === 'dark' ? 'text-white' : 'text-gray-900')}>
        <Clock className="h-5 w-5 mr-2" />
        Próximos Eventos
      </h2>

      <div className="space-y-3">
        {upcomingEvents.length > 0 ? (
          upcomingEvents.map(event => (
            <EventCard
              key={event.id}
              event={event}
              theme={theme}
            />
          ))
        ) : (
          <p className={cn('text-sm py-3 text-center', theme === 'dark' ? 'text-gray-400' : 'text-gray-500')}>
            No hay eventos próximos programados
          </p>
        )}
      </div>

      <div className="mt-4 text-center">
        <button className={cn('text-sm font-medium', theme === 'dark'
          ? 'text-blue-400 hover:text-blue-300'
          : 'text-blue-600 hover:text-blue-700'
        )}>
          Ver todos los eventos
        </button>
      </div>
    </section>
  )
}

export default UpcomingEventsSection
/*---------------------------------------------------------------------------------------------------------*/

/*--------------------------------------------------tools--------------------------------------------------*/
interface EventCardProps extends ThemeContextProps {
  event: CalendarEvent
}

function EventCard({ event, theme }: EventCardProps) {
  const priorityColors = {
    high: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
    medium: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300',
    low: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
  }

  const typeIcons = {
    maintenance: <Engineering className="h-10 w-10" style={{ color: getEventTypeColor(event.type) }} />,
    repair: <Plumbing className="h-10 w-10" style={{ color: getEventTypeColor(event.type) }} />,
    inspection: <ManageSearch className="h-10 w-10" style={{ color: getEventTypeColor(event.type) }} />,
    installation: <InstallMobile className="h-10 w-10" style={{ color: getEventTypeColor(event.type) }} />,
    meeting: <Groups2 className="h-10 w-10" style={{ color: getEventTypeColor(event.type) }} />,
    training: <ReduceCapacity className="h-10 w-10" style={{ color: getEventTypeColor(event.type) }} />
  }

  const formattedDate = format(parseISO(event.startDate), 'EEEE d', { locale: es })
  const formattedTime = format(parseISO(event.startDate), 'p', { locale: es })

  return (
    <div className={cn('p-3 rounded-lg border flex items-start', theme === 'dark'
      ? 'bg-zinc-900 border-zinc-800 hover:bg-zinc-800/50'
      : 'bg-gray-50 border-gray-200 hover:bg-gray-100/50'
    )}>
      <div className="mr-3">
        {typeIcons[event.type as keyof typeof typeIcons] ||
          <AlertCircle className="h-10 w-10 text-gray-400" />}
      </div>

      <div className="flex-1">
        <div className="flex items-start justify-between">
          <div>
            <h3 className={cn('font-medium', theme === 'dark' ? 'text-white' : 'text-gray-900')}>
              {event.title}
            </h3>
            <p className={cn('text-sm', theme === 'dark' ? 'text-gray-400' : 'text-gray-500')}>
              {event.clientName}
              {event.equipmentName && ` - ${event.equipmentName}`}
            </p>
          </div>

          <span className={cn('text-xs px-2 py-1 rounded-full font-medium',
            priorityColors[event.priority as keyof typeof priorityColors]
          )}>
            {event.priority === 'high' ? 'Alta' :
              event.priority === 'medium' ? 'Media' : 'Baja'}
          </span>
        </div>

        <div className="mt-2 grid grid-cols-2 gap-1">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-1 text-gray-500" />
            <span className={cn('text-xs', theme === 'dark' ? 'text-gray-400' : 'text-gray-500')}>
              {formattedDate}
            </span>
          </div>
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1 text-gray-500" />
            <span className={cn('text-xs', theme === 'dark' ? 'text-gray-400' : 'text-gray-500')}>
              {formattedTime}
            </span>
          </div>
        </div>

        <div className="mt-1 flex items-center">
          <MapPin className="h-4 w-4 mr-1 text-gray-500" />
          <span className={cn('text-xs', theme === 'dark' ? 'text-gray-400' : 'text-gray-500')}>
            {event.location}
          </span>
        </div>
      </div>
    </div>
  )
}

function getEventTypeColor(type: string): string {
  switch (type) {
    case 'maintenance':
      return '#3b82f6' // blue-500
    case 'repair':
      return '#ef4444' // red-500
    case 'inspection':
      return '#f59e0b' // amber-500
    case 'installation':
      return '#10b981' // green-500
    case 'meeting':
      return '#8b5cf6' // purple-500
    case 'training':
      return '#6366f1' // indigo-500
    default:
      return '#6b7280' // gray-500
  }
}