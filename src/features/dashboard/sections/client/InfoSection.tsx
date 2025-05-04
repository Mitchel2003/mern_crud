import { Activity, AlertCircle, Calendar, Check, Clock, Cog, Wrench } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "#/ui/card"
import { ClientDashboardProps } from "@/interfaces/props.interface"
import { ThemeContextProps } from "@/interfaces/context.interface"
import { Badge, BadgeProps } from "#/ui/badge"
import { ScrollArea } from "#/ui/scroll-area"
import { Warning } from "@mui/icons-material"
import { Progress } from "#/ui/progress"
import { cn } from "@/lib/utils"

interface InfoClientSectionProps extends ThemeContextProps {
  equipmentStatus: ClientDashboardProps['equipmentStatus']
  recentActivities: ClientDashboardProps['recentActivities']
  upcomingMaintenances: ClientDashboardProps['upcomingMaintenances']
}

/**
 * Sección de información del dashboard del cliente
 * Muestra el estado de equipos, próximos mantenimientos y actividades recientes
 */
const InfoSection = ({ theme, equipmentStatus, recentActivities, upcomingMaintenances }: InfoClientSectionProps) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Estado de Equipos */}
      <Card className={theme === 'dark' ? 'bg-zinc-950 border-zinc-700' : 'bg-white border-gray-100'}>
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Cog className="h-5 w-5 text-gray-500" />
            Estado de Equipos
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {equipmentStatus.map((status) => (
            <div key={status.id}>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">{status.name}</span>
                <span className="text-sm font-medium">{status.count}/{status.total}</span>
              </div>
              <Progress value={status.total > 0 ? Math.round((status.count / status.total) * 100) : 0} className={cn('h-2', status.color)} />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Próximos Mantenimientos */}
      <Card className={theme === 'dark' ? 'bg-zinc-950 border-zinc-700' : 'bg-white border-gray-100'}>
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Calendar className="h-5 w-5 text-blue-500" />
            Próximos Mantenimientos
          </CardTitle>
          <Badge variant="outline" className="bg-blue-50 text-blue-700 hover:bg-blue-50 dark:bg-blue-950 dark:text-blue-300 dark:hover:bg-blue-950">
            {upcomingMaintenances.length} programados
          </Badge>
        </CardHeader>
        <CardContent className="p-0">
          {upcomingMaintenances.length > 0 ? (
            <ScrollArea className="h-[calc(100vh-300px)]" type="always">
              <div className="space-y-2 p-4">
                {upcomingMaintenances.map((maintenance) => (
                  <div key={maintenance.id} className="p-3 rounded-lg border border-blue-100 bg-blue-50 dark:bg-blue-950/20 dark:border-blue-900/50 transition-all hover:shadow-md hover:border-blue-200 dark:hover:border-blue-800/50">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-full mr-2">
                          <Wrench className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        </div>
                        <h4 className="font-medium text-sm truncate max-w-[150px]" title={maintenance.equipment}>{maintenance.equipment}</h4>
                      </div>
                      <Badge variant="outline" className="hidden xl:flex h-5 bg-blue-50 text-blue-700 hover:bg-blue-50 dark:bg-blue-900/30 dark:text-blue-300 dark:hover:bg-blue-900/30">
                        {maintenance.type === 'preventivo' ? 'Preventivo' : 'Correctivo'}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mt-2">
                      <div className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1 flex-shrink-0" />
                        <span>{maintenance.date}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-3 w-3 mr-1 flex-shrink-0" />
                        <span className="hidden md:block">Programado</span>
                        <Badge variant="outline" className="md:hidden h-5 bg-blue-50 text-blue-700 hover:bg-blue-50 dark:bg-blue-900/30 dark:text-blue-300 dark:hover:bg-blue-900/30">
                          {maintenance.type === 'preventivo' ? 'Preventivo' : 'Correctivo'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          ) : (
            <div className="h-[300px] flex flex-col items-center justify-center">
              <Calendar className="h-10 w-10 text-gray-300 dark:text-gray-600 mb-2" />
              <p className="text-sm text-gray-500 dark:text-gray-400">No hay mantenimientos programados</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Actividad Reciente */}
      <Card className={theme === 'dark' ? 'bg-zinc-950 border-zinc-700' : 'bg-white border-gray-100'}>
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Activity className="h-5 w-5 text-green-500" />
            Actividad Reciente
          </CardTitle>
          <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-50 dark:bg-green-950 dark:text-green-300 dark:hover:bg-green-950">
            {recentActivities.length} actividades
          </Badge>
        </CardHeader>
        <CardContent className="p-0">
          {recentActivities.length > 0 ? (
            <ScrollArea className="h-[calc(100vh-300px)]" type="always">
              <div className="space-y-2 p-4">
                {recentActivities.map((activity) => {
                  const typeColors = colors({ theme })[activity.type] || colors({ theme }).maintenance
                  const statusMap: Record<string, BadgeProps['variant']> = { completed: 'success', pending: 'warning', urgent: 'destructive' }
                  const statusVariant: BadgeProps['variant'] = statusMap[activity.status] || 'outline'
                  return (
                    <div key={activity.id} className={cn('p-3 rounded-lg border transition-all hover:shadow-md', typeColors.border, typeColors.bg)}>
                      <div className="flex items-start">
                        <div className={cn('p-2 rounded-full mr-3 flex-shrink-0', typeColors.iconBg)}>
                          {activity.type === 'maintenance' ? (
                            <Wrench className={cn('h-4 w-4', typeColors.iconColor)} />
                          ) : activity.type === 'request' ? (
                            <Calendar className={cn('h-4 w-4', typeColors.iconColor)} />
                          ) : (
                            <Activity className={cn('h-4 w-4', typeColors.iconColor)} />
                          )}
                        </div>
                        <div className="w-full">
                          <div className="flex items-center">
                            <p className="text-sm font-medium truncate max-w-[150px]" title={activity.equipment}>{activity.equipment}</p>
                            <Badge variant={statusVariant} className="ml-auto h-5 flex-shrink-0">
                              {activity.status === 'completed' ? (
                                <Check className="h-3 w-3" />
                              ) : activity.status === 'pending' ? (
                                <Warning className="h-3 w-3" />
                              ) : (
                                <AlertCircle className="h-3 w-3" />
                              )}
                            </Badge>
                          </div>
                          <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mt-1">
                            <Clock className="h-3 w-3 mr-1 flex-shrink-0" />
                            <span>{activity.timeAgo}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </ScrollArea>
          ) : (
            <div className="h-[300px] flex flex-col items-center justify-center">
              <Activity className="h-10 w-10 text-gray-300 dark:text-gray-600 mb-2" />
              <p className="text-sm text-gray-500 dark:text-gray-400">No hay actividades recientes</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default InfoSection
/*---------------------------------------------------------------------------------------------------------*/

/*--------------------------------------------------tools--------------------------------------------------*/
// Determinar colores basados en el tipo de actividad
const colors = ({ theme }: ThemeContextProps) => ({
  maintenance: {
    border: theme === 'dark' ? 'border-green-800/20' : 'border-green-200',
    bg: theme === 'dark' ? 'bg-green-900/10' : 'bg-green-50',
    iconBg: theme === 'dark' ? 'bg-green-900/50' : 'bg-green-100',
    iconColor: theme === 'dark' ? 'text-green-400' : 'text-green-600'
  },
  request: {
    border: theme === 'dark' ? 'border-blue-800/20' : 'border-blue-200',
    bg: theme === 'dark' ? 'bg-blue-900/10' : 'bg-blue-50',
    iconBg: theme === 'dark' ? 'bg-blue-900/50' : 'bg-blue-100',
    iconColor: theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
  },
  alert: {
    border: theme === 'dark' ? 'border-red-800/20' : 'border-red-200',
    bg: theme === 'dark' ? 'bg-red-900/10' : 'bg-red-50',
    iconBg: theme === 'dark' ? 'bg-red-900/50' : 'bg-red-100',
    iconColor: theme === 'dark' ? 'text-red-400' : 'text-red-600'
  }
})