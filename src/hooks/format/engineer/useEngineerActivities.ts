import { Activity, Solicit, User } from '@/interfaces/context.interface'
import { useQueryFormat } from '@/hooks/query/useFormatQuery'
import { Event } from '@/hooks/ui/useCalendar'
import { useState, useMemo } from 'react'
import { format } from 'date-fns'

// Definimos un tipo para los datos que vamos a devolver
interface EngineerActivitiesData {
  activities: Activity[]
  error: Error | null
  isLoading: boolean
  events: Event[]
}

/**
 * Hook para obtener y formatear las actividades del ingeniero para el calendario
 * @returns Datos de actividades formateados para el calendario
 */
export const useEngineerActivities = (): EngineerActivitiesData => {
  const [activities, setActivities] = useState<Activity[]>([])
  const { data, isLoading, error } = useQueryFormat().fetchAllFormats<Activity>('activity')

  useMemo(() => { if (data) setActivities(data) }, [data])


  // Transformar las actividades en eventos para el calendario
  const events = useMemo(() => {
    return activities.map((activity): Event => {
      const solicit = activity.solicit as Solicit
      const engineer = activity.engineer as User

      // Determinamos el color basado en el estado de la actividad
      const getStatusColor = (status: Activity['status']): string => {
        switch (status) {
          case 'pendiente': return 'bg-yellow-500'
          case 'en proceso': return 'bg-blue-500'
          case 'completado': return 'bg-green-500'
          default: return 'bg-gray-500'
        }
      }

      // Determinamos la hora de inicio y fin (por ahora simulada)
      // En una implementación real, estos datos vendrían de la actividad
      const assignmentDate = new Date(activity.dateAssignment)
      const startTime = format(assignmentDate, 'HH:mm')
      const endHour = (parseInt(startTime.split(':')[0]) + 2) % 24 // Asumimos 2 horas de duración
      const endTime = `${endHour.toString().padStart(2, '0')}:${startTime.split(':')[1]}`

      return {
        id: parseInt(activity._id.substring(0, 8), 16), // Convertimos parte del ObjectId a número
        title: solicit.message || 'Actividad sin título',
        startTime,
        endTime,
        color: getStatusColor(activity.status),
        date: assignmentDate,
        description: `Actividad ${activity.status}. ${solicit.message}`,
        location: 'Ubicación no especificada', // Podríamos obtener esto de la relación con equipment o client
        attendees: [engineer.username || 'Ingeniero asignado'],
        organizer: 'Sistema GEST'
      }
    })
  }, [activities])

  return { error, events, isLoading, activities }
}