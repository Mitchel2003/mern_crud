import { Activity, Clock, Calendar, CheckCircle2, AlertCircle } from "lucide-react"
import { ThemeContextProps } from "@/interfaces/context.interface"
import { motion } from "framer-motion"
import { Button } from "#/ui/button"
import { Badge } from "#/ui/badge"
import { Card } from "#/ui/card"
import { cn } from "@/lib/utils"

// Datos simulados para el dashboard
const recentActivities = [
  {
    id: 1,
    type: "maintenance",
    status: "completed",
    equipment: "Equipo de Rayos X",
    date: "Hace 2 días",
    icon: CheckCircle2,
  },
  { id: 2, type: "request", status: "pending", equipment: "Resonador Magnético", date: "Hace 5 días", icon: Clock },
  { id: 3, type: "alert", status: "urgent", equipment: "Desfibrilador", date: "Hace 1 día", icon: AlertCircle },
]

const upcomingMaintenance = [
  { id: 1, equipment: "Ultrasonido Portátil", date: "23 Mar, 2023", type: "Preventivo" },
  { id: 2, equipment: "Equipo de Anestesia", date: "28 Mar, 2023", type: "Calibración" },
]

const equipmentStatus = [
  { id: 1, name: "Equipos Operativos", count: 8, total: 12, color: "bg-green-500" },
  { id: 2, name: "En Mantenimiento", count: 3, total: 12, color: "bg-amber-500" },
  { id: 3, name: "Fuera de Servicio", count: 1, total: 12, color: "bg-red-500" },
]

const InfoClientSection = ({ theme }: ThemeContextProps) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Estado de Equipos */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Activity className="mr-2 h-5 w-5 text-blue-600" />
          Estado de Equipos
        </h3>
        <div className="space-y-4">
          {equipmentStatus.map((status) => (
            <div key={status.id}>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium">{status.name}</span>
                <span className="text-sm text-gray-500">
                  {status.count}/{status.total}
                </span>
              </div>
              <div className="relative h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                <motion.div
                  className={`absolute top-0 left-0 h-full ${status.color}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${(status.count / status.total) * 100}%` }}
                  transition={{ duration: 1, delay: 0.2 }}
                />
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6">
          <Button variant="outline" className="w-full" onClick={() => { }}>
            Ver todos los equipos
          </Button>
        </div>
      </Card>

      {/* Actividad Reciente */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Clock className="mr-2 h-5 w-5 text-blue-600" />
          Actividad Reciente
        </h3>
        <div className="space-y-4">
          {recentActivities.map((activity) => {
            const Icon = activity.icon
            return (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: activity.id * 0.1 }}
                className="flex items-start"
              >
                <div
                  className={`
                        p-2 rounded-full mr-3 flex-shrink-0
                        ${activity.status === "completed"
                      ? "bg-green-100 text-green-600"
                      : activity.status === "pending"
                        ? "bg-amber-100 text-amber-600"
                        : "bg-red-100 text-red-600"
                    }
                      `}
                >
                  <Icon className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="font-medium text-sm">{activity.equipment}</h4>
                  <p className="text-xs text-gray-500">
                    {activity.status === "completed"
                      ? "Mantenimiento completado"
                      : activity.status === "pending"
                        ? "Solicitud en proceso"
                        : "Alerta de mantenimiento"}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">{activity.date}</p>
                </div>
              </motion.div>
            )
          })}
        </div>
        <div className="mt-6">
          <Button variant="outline" className="w-full" onClick={() => { }}>
            Ver toda la actividad
          </Button>
        </div>
      </Card>

      {/* Próximos Mantenimientos */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Calendar className="mr-2 h-5 w-5 text-blue-600" />
          Próximos Mantenimientos
        </h3>
        <div className="space-y-4">
          {upcomingMaintenance.map((maintenance) => (
            <motion.div
              key={maintenance.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: maintenance.id * 0.1 }}
              className={cn("flex items-center p-3 rounded-lg", theme === 'dark'
                ? 'bg-zinc-800'
                : 'bg-zinc-50'
              )}
            >
              <div className="bg-blue-100 text-blue-600 p-2 rounded-full mr-3">
                <Calendar className="h-4 w-4" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-sm">{maintenance.equipment}</h4>
                <div className="flex items-center mt-1">
                  <p className="text-xs text-gray-500 mr-2">{maintenance.date}</p>
                  <Badge variant="outline" className="text-xs">
                    {maintenance.type}
                  </Badge>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        <div className="mt-6">
          <Button variant="outline" className="w-full" onClick={() => { }}>
            Ver calendario completo
          </Button>
        </div>
      </Card>
    </div>
  )
}

export default InfoClientSection