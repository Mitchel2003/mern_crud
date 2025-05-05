import { CheckCircle, Clock, Play, Wrench, BookOpen, ClipboardList } from 'lucide-react'
import { useFormatMutation } from '@/hooks/query/useFormatQuery'
import { Activity } from '@/interfaces/context.interface'
import { useNavigate } from 'react-router-dom'
import { Event } from '@/features/calendar/hooks/useCalendar'
import { CardContent } from '#/ui/card'
import { Button } from '#/ui/button'

interface EventActionsProps {
  onClose?: () => void
  event: Event
}

/** 
 * Componente que muestra acciones contextuales según el tipo de actividad y su estado
 * Implementa componentes de Shadcn UI para una experiencia de usuario mejorada
 * y soporta modo oscuro a través del prop theme
 */
export const CalendarEventActions = ({ event, onClose }: EventActionsProps) => {
  const { updateFormat } = useFormatMutation('activity')
  const navigate = useNavigate()
  if (!event.metadata) return null

  const { activityId, activityStatus, solicitId } = event.metadata
  const activityType = determineActivityType(event.description)

  const updateActivityStatus = async (newStatus: Activity['status']) => {
    await updateFormat({ id: activityId, data: { status: newStatus } })
    if (onClose) onClose()
  }

  /** Handle main action based on activity type */
  const handleMainAction = () => {
    if (activityType === 'mantenimiento') navigate(`/form/maintenance?activityId=${activityId}&solicitId=${solicitId}`)
    else if (activityType === 'capacitación') navigate(`/form/training?activityId=${activityId}&solicitId=${solicitId}`)
    else if (activityType === 'acta de asistencia') navigate(`/form/attendance?activityId=${activityId}&solicitId=${solicitId}`)
    if (onClose) onClose()
  }
  return (
    <>
      <CardContent className="p-0 space-y-3">
        {/* Botón principal basado en el tipo de actividad */}
        {activityStatus !== 'completado' && (
          <Button variant="outline" onClick={handleMainAction} className="w-full justify-start font-medium bg-white/20 hover:bg-white/30 text-white border-white/10">
            {getActivityIcon(activityType)}
            {getActionTitle(activityType)}
          </Button>
        )}

        {/* Change activity status buttons */}
        {activityStatus === 'pendiente' && (
          <Button variant="default" onClick={() => updateActivityStatus('en proceso')} className="w-full justify-start bg-blue-600 hover:bg-blue-700 text-white">
            <Play className="h-5 w-5" />
            Iniciar actividad
          </Button>
        )}

        {activityStatus === 'en proceso' && (
          <Button variant="success" className="w-full justify-start" onClick={() => updateActivityStatus('completado')}>
            <CheckCircle className="h-5 w-5" />
            Marcar como completada
          </Button>
        )}

        {/* Show message when activity is completed */}
        {activityStatus === 'completado' && (
          <div className="bg-white/20 rounded-md p-3 text-center">
            <span className="flex items-center justify-center gap-2 text-white">
              <CheckCircle className="h-5 w-5 text-green-400" />
              Actividad completada
            </span>
          </div>
        )}
      </CardContent>
    </>
  )
}

export default CalendarEventActions
/*---------------------------------------------------------------------------------------------------------*/

/*--------------------------------------------------tools--------------------------------------------------*/
/** Determine activity type based on description or message */
export const determineActivityType = (message: string) => {
  const description = message.toLowerCase()
  if (description.includes('mantenimiento')) return 'mantenimiento'
  else if (description.includes('capacitación') || description.includes('capacitacion')) return 'capacitación'
  else if (description.includes('asistencia') || description.includes('reunión') || description.includes('reunion')) return 'acta de asistencia'
  return 'otro'
}

/** Returns the icon for the given activity type */
const getActivityIcon = (activityType: string) => {
  switch (activityType) {
    case 'mantenimiento': return <Wrench className="h-5 w-5" />
    case 'capacitación': return <BookOpen className="h-5 w-5" />
    case 'acta de asistencia': return <ClipboardList className="h-5 w-5" />
    default: return <Clock className="h-5 w-5" />
  }
}

/** Returns the title for the main action based on the activity type */
const getActionTitle = (activityType: string) => {
  switch (activityType) {
    case 'mantenimiento': return 'Realizar mantenimiento'
    case 'capacitación': return 'Impartir capacitación'
    case 'acta de asistencia': return 'Registrar asistencia'
    default: return 'Ver detalles'
  }
}