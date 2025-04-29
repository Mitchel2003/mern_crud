import { Curriculum, Maintenance, Solicit } from '@/interfaces/context.interface'
import { ClientDashboardProps } from '@/interfaces/props.interface'
import { useQueryFormat } from '@/hooks/query/useFormatQuery'
import { useAuthContext } from '@/context/AuthContext'
import { useEffect, useState } from 'react'

/**
 * Hook personalizado para gestionar los datos del dashboard del cliente
 * Proporciona estadísticas, actividades recientes y próximos mantenimientos
 */
export const useClientDashboard = () => {
  const [data, setData] = useState<ClientDashboardProps>(valueDefault)
  const queryFormat = useQueryFormat()
  const { user } = useAuthContext()

  // Obtener datos del backend
  const { data: solicits = [], isLoading: isLoadingSolicits } = queryFormat.fetchAllFormats<Solicit>('solicit')
  const { data: mts = [], isLoading: isLoadingMts } = queryFormat.fetchAllFormats<Maintenance>('maintenance')
  const { data: cvs = [], isLoading: isLoadingCvs } = queryFormat.fetchAllFormats<Curriculum>('cv')
  const loading = isLoadingCvs || isLoadingMts || isLoadingSolicits

  // Procesar datos cuando cambian las dependencias
  useEffect(() => {
    if (user && !loading) { processData() }
  }, [user, cvs, mts, solicits])

  /** Procesa los datos obtenidos del backend y actualiza el estado */
  const processData = () => {
    const now = new Date()

    // Clasificación de solicitudes por estado
    const completedSolicits = solicits.filter(s => s.status === 'cerrado')
    const pendingSolicits = solicits.filter(s => s.status === 'pendiente' || s.status === 'asignado')

    // Clasificación de mantenimientos por fecha y estado
    const pendingMaintenancesArray = mts.filter(m => m.dateNextMaintenance && new Date(m.dateNextMaintenance) > now)
    const completedMaintenancesArray = mts.filter(m => m.statusEquipment === 'funcionando')
    const maintenancesWithAlerts = mts.filter(m => m.dateNextMaintenance && new Date(m.dateNextMaintenance) < now)

    // Cálculo de estadísticas principales
    const totalCurriculums = cvs.length
    const totalMaintenances = mts.length
    const totalSolicits = completedSolicits.length
    const pendingSolicitsCount = pendingSolicits.length
    const pendingMaintenances = pendingMaintenancesArray.length
    const completedMaintenances = completedMaintenancesArray.length
    const activeAlerts = maintenancesWithAlerts.length

    /**
     * Genera las actividades recientes basadas en los mantenimientos
     * Ordenadas por fecha de actualización (más recientes primero)
     */
    const recentActivities: ClientDashboardProps['recentActivities'] = [...mts].sort((a, b) => {
      const dateA = a.updatedAt ? new Date(a.updatedAt).getTime() : new Date(a.dateMaintenance).getTime()
      const dateB = b.updatedAt ? new Date(b.updatedAt).getTime() : new Date(b.dateMaintenance).getTime()
      return dateB - dateA
    }).map(m => {
      const curriculum = cvs.find(cv => cv._id === m.curriculum._id)
      const activityDate = m.updatedAt ? new Date(m.updatedAt) : new Date(m.dateMaintenance)
      const timeAgo = getTimeAgo(activityDate)
      return {
        timeAgo, id: m._id,
        date: activityDate.toLocaleDateString(),
        equipment: curriculum?.name || 'Equipo sin nombre',
        type: m.typeMaintenance === 'preventivo' ? 'maintenance' : 'request',
        status: m.statusEquipment === 'funcionando' ? 'completed' : 'pending',
      }
    })

    /** Si hay alertas de mantenimientos vencidos, añadir la más reciente a las actividades*/
    if (activeAlerts > 0) {// Ordenar alertas por fecha (más recientes primero)
      const latestAlert = [...maintenancesWithAlerts].sort((a, b) => {
        const dateA = a.dateNextMaintenance ? new Date(a.dateNextMaintenance).getTime() : 0
        const dateB = b.dateNextMaintenance ? new Date(b.dateNextMaintenance).getTime() : 0
        return dateB - dateA
      })[0]

      if (latestAlert) {
        const curriculum = cvs.find(cv => cv._id === latestAlert.curriculum._id)
        recentActivities.push({
          type: 'alert',
          status: 'urgent',
          id: latestAlert._id,
          timeAgo: 'Mantenimiento vencido',
          equipment: curriculum?.name || 'Equipo sin nombre',
          date: new Date(latestAlert.dateNextMaintenance || new Date()).toLocaleDateString(),
        })
      }
    }

    /**
     * Genera la lista de próximos mantenimientos
     * Ordenados por fecha (más cercanos primero)
     */
    const upcomingMaintenances = pendingMaintenancesArray.sort((a, b) => {
      const dateA = a.dateNextMaintenance ? new Date(a.dateNextMaintenance).getTime() : 0
      const dateB = b.dateNextMaintenance ? new Date(b.dateNextMaintenance).getTime() : 0
      return dateA - dateB // Orden ascendente por fecha
    }).map(m => {
      const curriculum = cvs.find(cv => cv._id === m.curriculum._id)
      return {
        id: m._id,
        type: m.typeMaintenance || 'preventivo',
        equipment: curriculum?.name || 'Equipo sin nombre',
        date: new Date(m.dateNextMaintenance!).toLocaleDateString(),
      }
    })

    /**
     * Analiza el estado de los equipos basado en sus mantenimientos
     * Para cada currículum, se considera el mantenimiento más reciente
     */
    const curriculumsWithStatus = new Map<string, string>()
    mts.forEach(m => {// Asignar el último estado conocido a cada currículum
      const curriculumId = m.curriculum._id
      // Solo actualizar si es el mantenimiento más reciente para este currículum
      if (!curriculumsWithStatus.has(curriculumId) ||
        new Date(m.dateMaintenance) > new Date(curriculumsWithStatus.get(curriculumId + '_date') || 0)) {
        curriculumsWithStatus.set(curriculumId, m.statusEquipment)
        curriculumsWithStatus.set(curriculumId + '_date', m.dateMaintenance.toString())
      }
    })

    // Extraer y contar los estados de equipos
    const statusEntries = Array.from(curriculumsWithStatus.entries()).filter(([key]) => !key.includes('_date'))
    const operativeCount = statusEntries.filter(([_, value]) => value === 'funcionando').length
    const maintenanceCount = statusEntries.filter(([_, value]) => value === 'en espera de repuestos').length
    const outOfServiceCount = statusEntries.filter(([_, value]) => value === 'fuera de servicio').length

    // Para los currículums sin mantenimientos, asumimos que están operativos
    const curriculumsWithoutMaintenance = totalCurriculums - (operativeCount + maintenanceCount + outOfServiceCount)

    // Crear resumen de estado de equipos
    const equipmentStatus = [
      { id: 1, name: "Operativos", count: operativeCount + curriculumsWithoutMaintenance, total: totalCurriculums, color: "bg-green-500" },
      { id: 2, name: "En espera de repuestos", count: maintenanceCount, total: totalCurriculums, color: "bg-amber-500" },
      { id: 3, name: "Fuera de servicio", count: outOfServiceCount, total: totalCurriculums, color: "bg-red-500" },
    ]

    // Actualizar el estado con todos los datos procesados
    setData({
      // Estadísticas generales
      totalSolicits,
      totalCurriculums,
      totalMaintenances,
      completedMaintenances,
      pendingMaintenances,
      pendingSolicitsCount,
      activeAlerts,

      // Datos detallados
      equipmentStatus,
      recentActivities,
      upcomingMaintenances,
    })
  }

  return { data, loading }
}
/*---------------------------------------------------------------------------------------------------------*/

/*--------------------------------------------------tools--------------------------------------------------*/
/**
 * Calcula el tiempo transcurrido desde una fecha hasta ahora en formato legible
 * @param date La fecha desde la que calcular el tiempo transcurrido
 * @returns Cadena de texto con el tiempo transcurrido en formato legible
 */
function getTimeAgo(date: Date): string {
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays === 0) {
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    if (diffHours === 0) {
      const diffMinutes = Math.floor(diffMs / (1000 * 60))
      return `Hace ${diffMinutes} minutos`
    }
    return `Hace ${diffHours} horas`
  } else if (diffDays === 1) {
    return 'Hace 1 día'
  } else {
    return `Hace ${diffDays} días`
  }
}
/**
 * Valores por defecto para el estado inicial del dashboard
 */
const valueDefault: ClientDashboardProps = {
  // Estadísticas generales
  totalSolicits: 0,
  totalCurriculums: 0,
  totalMaintenances: 0,
  completedMaintenances: 0,
  pendingSolicitsCount: 0,
  pendingMaintenances: 0,
  activeAlerts: 0,

  // Datos detallados
  recentActivities: [],
  upcomingMaintenances: [],
  equipmentStatus: [
    { id: 1, name: "Operativos", count: 0, total: 0, color: "bg-green-500" },
    { id: 2, name: "En espera de repuestos", count: 0, total: 0, color: "bg-amber-500" },
    { id: 3, name: "Fuera de servicio", count: 0, total: 0, color: "bg-red-500" },
  ]
}