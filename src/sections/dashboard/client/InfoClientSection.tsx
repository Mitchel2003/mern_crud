import { ThemeContextProps } from "@/interfaces/context.interface"
import { Activity, Calendar, Clock, Cog, Wrench } from "lucide-react"
import { Card } from "#/ui/card"
import { Progress } from "@/components/ui/progress"
import { ClientDashboardData } from "@/hooks/dashboard/useClientDashboard"
import { cn } from "@/lib/utils"

interface InfoClientSectionProps extends ThemeContextProps {
  equipmentStatus: ClientDashboardData['equipmentStatus']
  recentActivities: ClientDashboardData['recentActivities']
  upcomingMaintenances: ClientDashboardData['upcomingMaintenances']
}

const InfoClientSection = ({ 
  theme, 
  equipmentStatus, 
  recentActivities, 
  upcomingMaintenances 
}: InfoClientSectionProps) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Estado de Equipos */}
      <Card className={cn('p-6 shadow-sm', theme === 'dark' ? 'bg-zinc-950 border-zinc-700' : 'bg-white border-gray-100')}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">Estado de Equipos</h3>
          <Cog className="h-5 w-5 text-gray-500" />
        </div>
        <div className="space-y-6">
          {equipmentStatus.map((status) => (
            <div key={status.id}>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">{status.name}</span>
                <span className="text-sm font-medium">{status.count}/{status.total}</span>
              </div>
              <Progress value={(status.count / status.total) * 100} className={cn('h-2', status.color)} />
            </div>
          ))}
        </div>
      </Card>

      {/* Actividad Reciente */}
      <Card className={cn('p-6 shadow-sm', theme === 'dark' ? 'bg-zinc-950 border-zinc-700' : 'bg-white border-gray-100')}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">Actividad Reciente</h3>
          <Activity className="h-5 w-5 text-gray-500" />
        </div>
        <div className="space-y-4">
          {recentActivities.length > 0 ? (
            recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start">
                <div className={cn('p-2 rounded-full mr-3', 
                  activity.type === 'maintenance' ? 'bg-green-100' : 
                  activity.type === 'request' ? 'bg-blue-100' : 'bg-red-100'
                )}>
                  {activity.type === 'maintenance' ? (
                    <Wrench className={cn('h-4 w-4', 
                      activity.type === 'maintenance' ? 'text-green-600' : 
                      activity.type === 'request' ? 'text-blue-600' : 'text-red-600'
                    )} />
                  ) : activity.type === 'request' ? (
                    <Calendar className="h-4 w-4 text-blue-600" />
                  ) : (
                    <Activity className="h-4 w-4 text-red-600" />
                  )}
                </div>
                <div>
                  <div className="flex items-center">
                    <p className="text-sm font-medium">{activity.equipment}</p>
                    <span className={cn('text-xs px-2 py-0.5 rounded ml-2', 
                      activity.status === 'completed' ? 'bg-green-100 text-green-800' : 
                      activity.status === 'pending' ? 'bg-amber-100 text-amber-800' : 
                      'bg-red-100 text-red-800'
                    )}>
                      {activity.status === 'completed' ? 'Completado' : 
                       activity.status === 'pending' ? 'Pendiente' : 'Urgente'}
                    </span>
                  </div>
                  <div className="flex items-center text-xs text-gray-500 mt-1">
                    <Clock className="h-3 w-3 mr-1" />
                    <span>{activity.timeAgo}</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500">No hay actividades recientes</p>
          )}
        </div>
      </Card>

      {/* Próximos Mantenimientos */}
      <Card className={cn('p-6 shadow-sm', theme === 'dark' ? 'bg-zinc-950 border-zinc-700' : 'bg-white border-gray-100')}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">Próximos Mantenimientos</h3>
          <Calendar className="h-5 w-5 text-gray-500" />
        </div>
        <div className="space-y-4">
          {upcomingMaintenances.length > 0 ? (
            upcomingMaintenances.map((maintenance) => (
              <div key={maintenance.id} className="flex items-start">
                <div className="p-2 bg-blue-100 rounded-full mr-3">
                  <Wrench className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium">{maintenance.equipment}</p>
                  <div className="flex items-center text-xs text-gray-500 mt-1">
                    <Calendar className="h-3 w-3 mr-1" />
                    <span>{maintenance.date} • {maintenance.type}</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500">No hay mantenimientos programados</p>
          )}
        </div>
      </Card>
    </div>
  )
}

export default InfoClientSection