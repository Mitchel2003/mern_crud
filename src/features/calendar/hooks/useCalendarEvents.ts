import { useFormatMutation } from '@/hooks/query/useFormatQuery'
import { Activity } from '@/interfaces/context.interface'
import { Event } from '@/interfaces/props.interface'
import { useState } from 'react'

interface CalendarEvents {
  completeActivity: () => Promise<void>
  resumeActivity: () => Promise<void>
  pauseActivity: () => Promise<void>
  startActivity: () => Promise<void>
  activityStatus: string
  isActive: boolean
}

/**
 * Hook para obtener y formatear las actividades del usuario para el calendario
 * @returns Datos de actividades formateados para el calendario
 */
export const useCalendarEvents = (event: Event, onClose?: () => void): CalendarEvents => {
  const { activityId, solicit, activityStatus: status, lastResumedAt: lastResumed, isActive: active } = event.metadata
  const [lastResumedAt, setLastResumedAt] = useState<Date | null>(lastResumed ? new Date(lastResumed) : null)
  const [activityStatus, setActivityStatus] = useState<Activity['status']>(status || 'pendiente')
  const { updateFormat: updateActivity } = useFormatMutation('activity')
  const { updateFormat: updateSolicit } = useFormatMutation('solicit')
  const [isActive, setIsActive] = useState<boolean>(active || false)


  // Iniciar actividad
  const startActivity = async () => {
    await updateActivity({ id: activityId, data: { status: 'en proceso', isActive: true, lastResumedAt: new Date() } })
    setActivityStatus('en proceso')
    setLastResumedAt(new Date())
    setIsActive(true)
  }

  // Pausar actividad
  const pauseActivity = async () => {
    if (!lastResumedAt) return
    const deltaSeconds = Math.floor((new Date().getTime() - lastResumedAt.getTime()) / 1000)
    await updateActivity({ id: activityId, data: { isActive: false, lastResumedAt: null, $inc: { timeSpent: deltaSeconds } } })
    setLastResumedAt(null)
    setIsActive(false)
  }

  // Reanudar actividad
  const resumeActivity = async () => {
    await updateActivity({ id: activityId, data: { isActive: true, lastResumedAt: new Date() } })
    setLastResumedAt(new Date())
    setIsActive(true)
  }

  // Completar actividad
  const completeActivity = async () => {
    let deltaSeconds = 0
    if (isActive && lastResumedAt) { //helps us to calculate the time spent on the activity
      deltaSeconds = Math.floor((new Date().getTime() - lastResumedAt.getTime()) / 1000)
    } //after the activity is completed, include the timeSpent to update
    await updateActivity({
      id: activityId,
      data: {
        status: 'completado', isActive: false, lastResumedAt: null,
        ...(deltaSeconds > 0 ? { $inc: { timeSpent: deltaSeconds } } : {})
      }
    }) //after update state solicit, so responsible company can be notified
    await updateSolicit({ id: solicit._id, data: { status: 'cerrado' } })
    setActivityStatus('completado')
    setLastResumedAt(null)
    setIsActive(false)
    onClose?.()
  }

  return { isActive, activityStatus, startActivity, pauseActivity, resumeActivity, completeActivity }
}