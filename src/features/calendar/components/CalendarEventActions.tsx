import { CheckCircle, Clock, Play, PlayIcon, PauseIcon, SquareActivity } from 'lucide-react'
import DetailsSolicitDrawer from '@/features/calendar/components/DetailsSolicitDrawer'
import { useCalendarEvents } from '@/features/calendar/hooks/useCalendarEvents'
import { ThemeContextProps } from '@/interfaces/context.interface'
import { Event } from '@/interfaces/props.interface'
import { encodeQueryParams } from "@/lib/query"
import { useNavigate } from "react-router-dom"
import { CardContent } from '#/ui/card'
import { Button } from '#/ui/button'
import { useState } from 'react'

interface EventActionsProps extends ThemeContextProps {
  onClose?: () => void
  event: Event
}

/** 
 * Componente que muestra acciones contextuales según el tipo de actividad y su estado
 * Implementa componentes de Shadcn UI para una experiencia de usuario mejorada
 * y soporta modo oscuro a través del prop theme
 */
export const CalendarEventActions = ({ theme, event, onClose }: EventActionsProps) => {
  const { isActive, activityStatus, startActivity, pauseActivity, resumeActivity, completeActivity } = useCalendarEvents(event, onClose)
  const [detailsDrawerOpen, setDetailsDrawerOpen] = useState(false)
  return (
    <>
      <CardContent className="p-0 space-y-3">
        {/* Botón principal basado en el tipo de actividad */}
        {activityStatus !== 'completado' && (
          <Button
            variant="outline"
            onClick={() => setDetailsDrawerOpen(true)}
            className="w-full justify-start font-medium bg-white/20 hover:bg-white/30 text-white border-white/10"
          >
            <Clock className="h-5 w-5" />
            Ver detalles
          </Button>
        )}

        <ActionButton
          event={event}
          isActive={isActive}
          status={activityStatus}
          startActivity={startActivity}
          pauseActivity={pauseActivity}
          resumeActivity={resumeActivity}
          completeActivity={completeActivity}
        />
      </CardContent>

      {/** Drawers (toogleable) */}
      <DetailsSolicitDrawer
        theme={theme}
        isOpen={detailsDrawerOpen}
        solicit={event.metadata?.solicit}
        onClose={() => setDetailsDrawerOpen(false)}
      />
    </>
  )
}

export default CalendarEventActions
/*---------------------------------------------------------------------------------------------------------*/

/*--------------------------------------------------tools--------------------------------------------------*/
interface ActionButtonProps {
  completeActivity: () => Promise<void>
  resumeActivity: () => Promise<void>
  pauseActivity: () => Promise<void>
  startActivity: () => Promise<void>
  isActive: boolean
  status: string
  event: Event
}

/** Renderiza los botones según el estado de la actividad */
const ActionButton = ({ event, status, isActive, startActivity, pauseActivity, resumeActivity, completeActivity }: ActionButtonProps) => {
  const navigate = useNavigate()
  switch (status) {
    case 'pendiente':
      return (
        <Button variant="default" onClick={startActivity} className="w-full justify-start bg-blue-600 hover:bg-blue-700 text-white">
          <Play className="h-5 w-5" />
          Iniciar actividad
        </Button>
      )
    case 'en proceso':
      return (
        <>
          {/* Boton de mantenimiento */}
          <Button variant="secondary" className="w-full justify-start" onClick={() => navigate(`/form/maintenance/${encodeQueryParams({ curriculumId: event.metadata?.curriculumId })}`)}>
            <SquareActivity className="h-5 w-5" />
            Realizar mantenimiento
          </Button>

          {/* Botones de pausa y continuar */}
          <Button variant={isActive ? 'destructive' : 'warning'} className="w-full justify-start" onClick={isActive ? pauseActivity : resumeActivity}>
            {isActive ? <PauseIcon /> : <PlayIcon />}
            {isActive ? 'Pausar actividad' : 'Continuar actividad'}
          </Button>

          {/* Boton de completar actividad */}
          <Button variant="success" className="w-full justify-start" onClick={completeActivity}>
            <CheckCircle className="h-5 w-5" />
            Marcar como completada
          </Button>
        </>
      )
    case 'completado':
      return (
        <div className="bg-white/20 rounded-md p-3 text-center">
          <span className="flex items-center justify-center gap-2 text-white">
            <CheckCircle className="h-5 w-5 text-green-400" />
            Actividad completada
          </span>
        </div>
      )
  }
}