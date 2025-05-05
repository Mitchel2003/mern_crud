import { determineActivityType } from '@/features/calendar/components/CalendarEventActions'
import { Activity, Curriculum, Solicit } from '@/interfaces/context.interface'
import { useQueryFormat } from '@/hooks/query/useFormatQuery'
import { Event } from '@/interfaces/props.interface'
import { useState, useMemo } from 'react'
import { format } from 'date-fns'

interface CalendarActivitiesData {
  error: Error | null
  isLoading: boolean
  events: Event[]
}

/**
 * Hook para obtener y formatear las actividades del usuario para el calendario
 * @returns Datos de actividades formateados para el calendario
 */
export const useCalendarActivities = (): CalendarActivitiesData => {
  const { data, isLoading, error } = useQueryFormat().fetchAllFormats<Activity>('activity')
  const [activities, setActivities] = useState<Activity[]>([])
  useMemo(() => { if (data) setActivities(data) }, [data])

  /** Transformar las actividades en eventos para el calendario */
  const events = useMemo(() => {
    return activities.map((activity): Event => {
      const solicit = activity.solicit
      const curriculum = solicit.curriculum
      const collaborator = activity.collaborator

      /** determine start and end time (simulated for now) */
      const assignmentDate = new Date(activity.dateAssignment)
      const startTime = format(assignmentDate, 'HH:mm') //helps to check time format
      const endHour = (parseInt(startTime.split(':')[0]) + 2) % 24 // assume 2 hours duration
      const endTime = `${endHour.toString().padStart(2, '0')}:${startTime.split(':')[1]}`

      return {
        id: parseInt(activity._id.substring(0, 8), 16), // convert ObjectId to number
        endTime,
        startTime,
        date: assignmentDate,
        organizer: 'Sistema calendario',
        color: getStatusColor(activity.status),
        title: solicit.message || 'Actividad sin título',
        attendees: [collaborator.username || 'Colaborador asignado'],
        description: `Actividad ${activity.status}. ${solicit.message}`,
        location: `${curriculum?.office?.headquarter?.address} - ${curriculum?.office?.headquarter?.city?.name}` || 'Ubicación no especificada',
        client: `${curriculum?.office?.headquarter?.client?.username} - Sede ${curriculum?.office?.headquarter?.name}` || 'Cliente no especificado',
        // Añadimos los metadatos necesarios para acciones contextuales
        metadata: getMetadata(activity, solicit, curriculum)
      }
    })
  }, [activities])

  return { error, events, isLoading }
}
/*---------------------------------------------------------------------------------------------------------*/

/*--------------------------------------------------tools--------------------------------------------------*/
const getStatusColor = (status: Activity['status']): string => {
  switch (status) {
    case 'pendiente': return 'bg-yellow-500'
    case 'en proceso': return 'bg-blue-500'
    case 'completado': return 'bg-green-500'
    default: return 'bg-gray-500'
  }
}

/** Returns metadata */
const getMetadata = (activity: Activity, solicit: Solicit, curriculum: Curriculum): Event['metadata'] => {
  return {
    solicitId: solicit._id,
    activityId: activity._id,
    priority: solicit.priority,
    curriculumId: curriculum?._id,
    solicitStatus: solicit.status, // Estado de la solicitud
    activityStatus: activity.status, // Estado actual (pendiente, en proceso, completado)
    activityType: determineActivityType(solicit.message), // Tipo de actividad (mantenimiento, capacitación, etc.)
  }
}