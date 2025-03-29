import { Curriculum, Maintenance } from '@/interfaces/context.interface'
import { ClientDashboardProps } from '@/interfaces/props.interface'
import { useQueryFormat } from '@/hooks/query/useFormatQuery'
import { useAuthContext } from '@/context/AuthContext'
import { useEffect, useState } from 'react'

export const useClientDashboard = () => {
  const [data, setData] = useState<ClientDashboardProps>(valueDefault)
  const queryFormat = useQueryFormat()
  const { user } = useAuthContext()

  // Obtener currículos y mantenimientos fuera del useEffect
  const { data: mts = [], isLoading: isLoadingMts } = queryFormat.fetchAllFormats<Maintenance>('maintenance')
  const { data: cvs = [], isLoading: isLoadingCvs } = queryFormat.fetchAllFormats<Curriculum>('cv')
  const loading = isLoadingCvs || isLoadingMts

  useEffect(() => { user && processData() }, [user, cvs, mts])

  const processData = () => {
    // Filtrar currículos asociados al cliente actual
    const curriculums = cvs.filter(cv => {
      // Si el currículum tiene una propiedad office y esa office tiene un user
      if (cv.office && typeof cv.office === 'object' && cv.office.headquarter) {
        const headquarter = cv.office.headquarter
        if (typeof headquarter === 'object' && headquarter.user) {
          // Verificar si el user del headquarter es el mismo que el usuario actual
          return headquarter.user._id === user?._id
        }
      }
      return false
    })

    // Filtrar mantenimientos asociados a los currículos del cliente
    const maintenances = mts.filter(m => {
      const curriculumId = typeof m.curriculum === 'string' ? m.curriculum : m.curriculum._id
      return curriculums.some(cv => cv._id === curriculumId)
    })

    // Calcular estadísticas
    const totalCurriculums = curriculums.length
    const totalMaintenances = maintenances.length

    // Mantenimientos pendientes (aquellos con fecha futura)
    const now = new Date()
    const pendingMaintenances = maintenances.filter(m => m.dateNextMaintenance && new Date(m.dateNextMaintenance) > now).length
    // Mantenimientos completados
    const completedMaintenances = maintenances.filter(m => m.statusEquipment === 'funcionando').length

    // Alertas activas (mantenimientos con fecha vencida)
    const maintenancesWithAlerts = maintenances.filter(m => m.dateNextMaintenance && new Date(m.dateNextMaintenance) < now)
    const activeAlerts = maintenancesWithAlerts.length

    // Actividades recientes (basadas en updatedAt)
    const recentActivities: ClientDashboardProps['recentActivities'] = maintenances.sort((a, b) => {
      const dateA = a.updatedAt ? new Date(a.updatedAt).getTime() : new Date(a.dateMaintenance).getTime()
      const dateB = b.updatedAt ? new Date(b.updatedAt).getTime() : new Date(b.dateMaintenance).getTime()
      return dateB - dateA
    }).slice(0, 3).map(m => {
      // Buscar el currículum correspondiente al mantenimiento
      const curriculumId = typeof m.curriculum === 'string' ? m.curriculum : m.curriculum._id
      const curriculum = curriculums.find(cv => cv._id === curriculumId)
      // Usar updatedAt si está disponible, de lo contrario usar dateMaintenance
      const activityDate = m.updatedAt ? new Date(m.updatedAt) : new Date(m.dateMaintenance)
      const timeAgo = getTimeAgo(activityDate)
      return {
        timeAgo,
        id: m._id,
        date: activityDate.toLocaleDateString(),
        equipment: curriculum?.name || 'Equipo sin nombre',
        type: m.typeMaintenance === 'preventivo' ? 'maintenance' : 'request',
        status: m.statusEquipment === 'funcionando' ? 'completed' : 'pending',
      }
    })

    // Si hay alertas, añadirlas a las actividades recientes
    if (activeAlerts > 0) {
      // Tomar la alerta más reciente
      const latestAlert = maintenancesWithAlerts.sort((a, b) => {
        const dateA = a.dateNextMaintenance ? new Date(a.dateNextMaintenance).getTime() : 0
        const dateB = b.dateNextMaintenance ? new Date(b.dateNextMaintenance).getTime() : 0
        return dateB - dateA
      })[0]

      if (latestAlert) {
        // Buscar el currículum correspondiente al mantenimiento
        const curriculumId = typeof latestAlert.curriculum === 'string' ? latestAlert.curriculum : latestAlert.curriculum._id
        const curriculum = curriculums.find(cv => cv._id === curriculumId)
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

    // Próximos mantenimientos
    const upcomingMaintenances = maintenances.filter(m => m.dateNextMaintenance && new Date(m.dateNextMaintenance) > now).sort((a, b) => {
      const dateA = a.dateNextMaintenance ? new Date(a.dateNextMaintenance).getTime() : 0
      const dateB = b.dateNextMaintenance ? new Date(b.dateNextMaintenance).getTime() : 0
      return dateA - dateB
    }).slice(0, 2).map(m => {
      // Buscar el currículum correspondiente al mantenimiento
      const curriculumId = typeof m.curriculum === 'string' ? m.curriculum : m.curriculum._id
      const curriculum = curriculums.find(cv => cv._id === curriculumId)
      return {
        id: m._id,
        type: m.typeMaintenance || 'preventivo',
        equipment: curriculum?.name || 'Equipo sin nombre',
        date: new Date(m.dateNextMaintenance!).toLocaleDateString(),
      }
    })

    // Estado de equipos basado en los mantenimientos
    // Contamos cuántos currículums tienen mantenimientos con diferentes estados
    const curriculumsWithStatus = new Map<string, string>()

    // Primero asignamos el último estado conocido a cada currículum
    maintenances.forEach(m => {
      const curriculumId = typeof m.curriculum === 'string' ? m.curriculum : m.curriculum._id
      // Solo actualizar si es el mantenimiento más reciente para este currículum
      if (!curriculumsWithStatus.has(curriculumId) ||
        new Date(m.dateMaintenance) > new Date(curriculumsWithStatus.get(curriculumId + '_date') || 0)) {
        curriculumsWithStatus.set(curriculumId, m.statusEquipment)
        curriculumsWithStatus.set(curriculumId + '_date', m.dateMaintenance.toString())
      }
    })

    // Contar currículums por estado
    const operativeCount = Array.from(curriculumsWithStatus.entries())
      .filter(([key, value]) => !key.includes('_date') && value === 'funcionando').length

    const maintenanceCount = Array.from(curriculumsWithStatus.entries())
      .filter(([key, value]) => !key.includes('_date') && value === 'en espera de repuestos').length

    const outOfServiceCount = Array.from(curriculumsWithStatus.entries())
      .filter(([key, value]) => !key.includes('_date') && value === 'fuera de servicio').length

    // Para los currículums sin mantenimientos, asumimos que están operativos
    const curriculumsWithoutMaintenance = totalCurriculums -
      (operativeCount + maintenanceCount + outOfServiceCount)

    const equipmentStatus = [
      {
        id: 1,
        name: "Operativos",
        count: operativeCount + curriculumsWithoutMaintenance,
        total: totalCurriculums,
        color: "bg-green-500"
      },
      {
        id: 2,
        name: "En espera de repuestos",
        count: maintenanceCount,
        total: totalCurriculums,
        color: "bg-amber-500"
      },
      {
        id: 3,
        name: "Fuera de servicio",
        count: outOfServiceCount,
        total: totalCurriculums,
        color: "bg-red-500"
      },
    ]

    // Documentos (asumimos 2 documentos por currículum como mínimo)
    const totalDocuments = totalCurriculums * 2
    setData({
      activeAlerts,
      equipmentStatus,
      recentActivities,
      totalDocuments,
      totalCurriculums,
      totalMaintenances,
      pendingMaintenances,
      upcomingMaintenances,
      completedMaintenances,
    })
  }

  return { data, loading }
}
/*---------------------------------------------------------------------------------------------------------*/

/*--------------------------------------------------tools--------------------------------------------------*/
// Función auxiliar para calcular tiempo transcurrido
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
// Valor por defecto para el estado inicial
const valueDefault: ClientDashboardProps = {
  totalCurriculums: 0,
  totalMaintenances: 0,
  pendingMaintenances: 0,
  completedMaintenances: 0,
  activeAlerts: 0,
  recentActivities: [],
  upcomingMaintenances: [],
  totalDocuments: 0,
  equipmentStatus: [
    { id: 1, name: "Operativos", count: 0, total: 0, color: "bg-green-500" },
    { id: 2, name: "En Mantenimiento", count: 0, total: 0, color: "bg-amber-500" },
    { id: 3, name: "Fuera de Servicio", count: 0, total: 0, color: "bg-red-500" },
  ]
}