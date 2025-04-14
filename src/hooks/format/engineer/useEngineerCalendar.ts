// import { useState, useEffect } from 'react'
// import { useAuthContext } from '@/context/AuthContext'
// import { useEngineerActivities } from './useEngineerActivities'



// export interface TeamMember {
//   availability: 'available' | 'busy' | 'away'
//   avatar: string
//   role: string
//   name: string
//   id: string
// }

// interface EngineerCalendarData {
//   upcomingEvents: CalendarEvent[]
//   teamMembers: TeamMember[]
//   stats: {
//     total: number
//     pending: number
//     inProgress: number
//     completed: number
//   }
//   loading: boolean
// }

// /**
//  * Hook para obtener y formatear los datos del calendario del ingeniero
//  * @returns Datos formateados para el calendario
//  */
// export const useEngineerCalendar = (): EngineerCalendarData => {
//   const { user } = useAuthContext()
//   const { activities, events, isLoading } = useEngineerActivities()
//   const [data, setData] = useState<EngineerCalendarData>({
//     upcomingEvents: [],
//     teamMembers: [],
//     stats: {
//       total: 0,
//       pending: 0,
//       inProgress: 0,
//       completed: 0
//     },
//     loading: true
//   })

//   // Efecto para transformar los datos de actividades en eventos de calendario
//   useEffect(() => {
//     if (isLoading) return

//     // Transformar actividades en eventos de calendario
//     const upcomingEvents: CalendarEvent[] = activities.map(activity => {
//       const solicit = activity.solicit as any
//       const equipment = solicit?.cu?.equipment
//       const company = equipment?.company

//       // Determinar el tipo de evento basado en el mensaje de la solicitud
//       const determineEventType = (message: string): CalendarEvent['type'] => {
//         const msg = message.toLowerCase()
//         if (msg.includes('mantenimiento')) return 'maintenance'
//         if (msg.includes('reunión') || msg.includes('reunion')) return 'meeting'
//         if (msg.includes('reparación') || msg.includes('reparacion')) return 'repair'
//         if (msg.includes('inspección') || msg.includes('inspeccion')) return 'inspection'
//         if (msg.includes('instalación') || msg.includes('instalacion')) return 'installation'
//         if (msg.includes('capacitación') || msg.includes('capacitacion') || msg.includes('entrenamiento')) return 'training'
//         return 'maintenance' // Por defecto
//       }

//       // Determinar la prioridad basada en el campo de prioridad de la solicitud
//       const determinePriority = (priority: boolean): CalendarEvent['priority'] => {
//         return priority ? 'high' : 'medium'
//       }

//       // Calcular fecha de fin (2 horas después de la fecha de inicio)
//       const startDate = new Date(activity.dateAssignment)
//       const endDate = new Date(startDate)
//       endDate.setHours(endDate.getHours() + 2)

//       return {
//         priority: determinePriority(solicit?.priority || false),
//         location: company?.name || 'Ubicación no especificada',
//         title: solicit?.message || 'Actividad sin título',
//         type: determineEventType(solicit?.message || ''),
//         startDate: startDate.toISOString(),
//         equipmentName: equipment?.name,
//         endDate: endDate.toISOString(),
//         clientName: company?.name,
//         id: activity._id,
//       }
//     })

//     // Generar datos de miembros del equipo (simulados por ahora)
//     const teamMembers: TeamMember[] = [
//       {
//         id: '1',
//         name: user?.username || 'Ingeniero Actual',
//         role: 'Ingeniero Principal',
//         avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
//         availability: 'available'
//       },
//       {
//         id: '2',
//         name: 'Carlos Rodríguez',
//         role: 'Técnico Especialista',
//         avatar: 'https://randomuser.me/api/portraits/men/43.jpg',
//         availability: 'busy'
//       },
//       {
//         id: '3',
//         name: 'Ana Martínez',
//         role: 'Ingeniera de Soporte',
//         avatar: 'https://randomuser.me/api/portraits/women/28.jpg',
//         availability: 'available'
//       },
//       {
//         id: '4',
//         name: 'Miguel Sánchez',
//         role: 'Técnico de Campo',
//         avatar: 'https://randomuser.me/api/portraits/men/52.jpg',
//         availability: 'away'
//       }
//     ]

//     // Calcular estadísticas
//     const stats = {
//       total: activities.length,
//       pending: activities.filter(a => a.status === 'pendiente').length,
//       completed: activities.filter(a => a.status === 'completado').length,
//       inProgress: activities.filter(a => a.status === 'en proceso').length,
//     }

//     // Actualizar el estado con los datos procesados
//     setData({
//       upcomingEvents,
//       loading: false,
//       teamMembers,
//       stats,
//     })
//   }, [activities, isLoading, user])

//   return data
// }