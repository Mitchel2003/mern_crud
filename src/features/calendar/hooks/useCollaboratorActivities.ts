import { useCalendarEvents, CalendarEventsResult } from './useCalendarEvents'
import { Activity, Solicit, User } from '@/interfaces/context.interface'
import { useQueryFormat } from '@/hooks/query/useFormatQuery'
import { Event } from '@/hooks/ui/useCalendar'
import { format } from 'date-fns'

/**
 * Hook para obtener y formatear las actividades del ingeniero para el calendario
 * Utiliza el hook genérico useCalendarEvents para la lógica de obtención y transformación de datos
 * @returns Datos de actividades formateados para el calendario
 */
export const useCollaboratorActivities = (): CalendarEventsResult<Activity> => {
  const { data } = useQueryFormat().fetchAllFormats<Activity>('activity')

  // Función para transformar las actividades en eventos del calendario
  const transformActivitiesToEvents = (activities: Activity[]): Event[] => {
    return activities.map((activity): Event => {
      const solicit = activity.solicit as Solicit
      const collaborator = activity.collaborator as User

      // Determinamos la hora de inicio y fin (por ahora simulada)
      // En una implementación real, estos datos vendrían de la actividad
      const assignmentDate = new Date(activity.dateAssignment)
      const startTime = format(assignmentDate, 'HH:mm')
      const endHour = (parseInt(startTime.split(':')[0]) + 2) % 24 // Asumimos 2 horas de duración
      const endTime = `${endHour.toString().padStart(2, '0')}:${startTime.split(':')[1]}`

      return {
        endTime,
        startTime,
        date: assignmentDate,
        organizer: 'Sistema GEST',
        color: getStatusColor(activity.status),
        title: solicit.message || 'Actividad sin título',
        attendees: [collaborator.username || 'Colaborador asignado'],
        description: `Actividad ${activity.status}. ${solicit.message}`,
        id: parseInt(activity._id.substring(0, 8), 16), // Convertimos parte del ObjectId a número
        location: 'Ubicación no especificada', // Podríamos obtener esto de la relación con equipment o client
      }
    })
  }

  return useCalendarEvents<Activity>(() => Promise.resolve(data || []), transformActivitiesToEvents)
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