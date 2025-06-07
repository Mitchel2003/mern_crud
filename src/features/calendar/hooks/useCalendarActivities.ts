import { Activity, Curriculum, Solicit } from '@/interfaces/context.interface'
import { useQueryFormat } from '@/hooks/query/useFormatQuery'
import { useState, useMemo, useEffect } from 'react'
import { Event } from '@/interfaces/props.interface'

interface CalendarActivities {
  error: Error | null
  isLoading: boolean
  events: Event[]
}

/**
 * Hook para obtener y formatear las actividades del usuario para el calendario
 * @returns Datos de actividades formateados para el calendario
 */
export const useCalendarActivities = (): CalendarActivities => {
  const [activities, setActivities] = useState<Activity[]>([])

  /** get query activities to build events calendar, we got activities for user logged */
  const { data, isLoading, error } = useQueryFormat().fetchAllFormats<Activity>('activity')
  useEffect(() => { if (data) setActivities(data) }, [data])

  /** activities to events calendar */
  const events = useMemo(() => {
    return activities.map((activity): Event => {
      const assignmentDate = new Date(activity.dateAssignment)
      const startTime = activity?.timeHours?.start || '08:00'
      const endTime = activity?.timeHours?.end || '13:00'
      const curriculum = activity.solicit.curriculum
      const collaborator = activity.collaborator
      const solicit = activity.solicit

      return {
        id: activity._id,
        color: getStatusColor(activity.status),
        date: assignmentDate, endTime, startTime,
        title: solicit.message || 'Actividad sin título',
        attendees: [collaborator.username || 'Colaborador asignado'],
        description: `Actividad ${activity.status}; ${activity.description}`,
        location: `${curriculum?.office?.headquarter?.address} - ${curriculum?.office?.headquarter?.city?.name}` || 'Ubicación no especificada',
        client: `${curriculum?.office?.headquarter?.client?.username} - Sede ${curriculum?.office?.headquarter?.name}` || 'Cliente no especificado',
        // Añadimos los metadatos necesarios para acciones contextuales
        metadata: getMetadata(activity, solicit, curriculum)
      }
    })
  }, [activities, data])
  return { error, events, isLoading }
}
/*---------------------------------------------------------------------------------------------------------*/

/*--------------------------------------------------tools--------------------------------------------------*/
/** Returns metadata for event; allow work with information contextually */
const getMetadata = (activity: Activity, solicit: Solicit, curriculum: Curriculum) => {
  return { //extract information from activity and solicit to know details
    priority: solicit.priority, activityStatus: activity.status,
    lastResumedAt: activity.lastResumedAt,
    curriculumId: curriculum?._id,
    timeSpent: activity.timeSpent,
    isActive: activity.isActive,
    activityId: activity._id,
    solicit: solicit,
  } as Event['metadata']
}

/** Returns color based on activity status */
const getStatusColor = (status: Activity['status']): string => {
  switch (status) {
    case 'pendiente': return 'bg-yellow-500'
    case 'en proceso': return 'bg-blue-500'
    case 'completado': return 'bg-green-500'
    default: return 'bg-gray-500'
  }
}