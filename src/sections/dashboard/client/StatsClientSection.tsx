import { ThemeContextProps } from "@/interfaces/context.interface"
import { Activity, AlertCircle, Shield, Zap } from "lucide-react"
import { cn } from "@/lib/utils"

const StatsClientSection = ({ theme }: ThemeContextProps) => {
  return (
    <section className={cn('p-6 rounded-lg shadow-sm border', theme === 'dark'
      ? 'bg-zinc-950 border-zinc-700'
      : 'bg-white border-gray-100'
    )}>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <StatCard
          title="Total de Equipos"
          value="12"
          icon={<Shield className="h-5 w-5 text-blue-600" />}
          change="+2 este mes"
          trend="up"
        />
        <StatCard
          title="Mantenimientos"
          value="24"
          icon={<Activity className="h-5 w-5 text-green-600" />}
          change="8 pendientes"
          trend="neutral"
        />
        <StatCard
          title="Tiempo de Actividad"
          value="98.2%"
          icon={<Zap className="h-5 w-5 text-amber-600" />}
          change="+0.5% vs mes anterior"
          trend="up"
        />
        <StatCard
          title="Alertas Activas"
          value="3"
          icon={<AlertCircle className="h-5 w-5 text-red-600" />}
          change="-2 vs mes anterior"
          trend="down"
        />
      </div>
    </section >
  )
}

export default StatsClientSection
/*---------------------------------------------------------------------------------------------------------*/

/*--------------------------------------------------tools--------------------------------------------------*/
interface StatCardProps {
  trend: "up" | "down" | "neutral"
  icon: React.ReactNode
  change: string
  title: string
  value: string
}

function StatCard({ title, value, icon, change, trend }: StatCardProps) {
  return (
    <div className="flex flex-col">
      <div className="flex items-center mb-2">
        <div className="mr-2">{icon}</div>
        <span className="text-sm font-medium text-gray-500">{title}</span>
      </div>
      <div className="text-2xl font-bold mb-1">{value}</div>
      <div className={`text-xs ${trend === "up" ? "text-green-600" : trend === "down" ? "text-red-600" : "text-gray-500"}`}>
        {change}
      </div>
    </div >
  )
}