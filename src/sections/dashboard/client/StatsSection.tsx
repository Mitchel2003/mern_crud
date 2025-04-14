import { ClientDashboardProps } from "@/interfaces/props.interface"
import { ThemeContextProps } from "@/interfaces/context.interface"
import { Activity, Shield, Zap } from "lucide-react"
import { Separator } from "#/ui/separator"
import { cn } from "@/lib/utils"

interface StatsSectionProps extends ThemeContextProps {
  data: ClientDashboardProps
}

const StatsSection = ({ theme, data }: StatsSectionProps) => {
  return (
    <section className={cn('p-6 rounded-lg shadow-sm border', theme === 'dark'
      ? 'bg-zinc-950 border-zinc-700'
      : 'bg-white border-gray-100'
    )}>
      <div className="grid sm:grid-cols-3 gap-6">
        <StatCard
          title="Total de Equipos"
          value={data.totalCurriculums.toString()}
          icon={<Shield className="h-5 w-5 text-blue-600" />}
          change={`${data.totalCurriculums > 0 ? '+' : ''}${data.totalCurriculums} equipos`}
          trend="up"
        />
        <Separator orientation="horizontal" className="block sm:hidden" />
        <StatCard
          title="Mantenimientos"
          value={data.totalMaintenances.toString()}
          icon={<Activity className="h-5 w-5 text-green-600" />}
          change={`${data.pendingMaintenances} pendientes`}
          trend="neutral"
        />
        <Separator orientation="horizontal" className="block sm:hidden" />
        <StatCard
          title="Mantenimientos Completados"
          value={`${data.completedMaintenances}`}
          icon={<Zap className="h-5 w-5 text-amber-600" />}
          change={data.completedMaintenances > 0 ? "Buen rendimiento" : "Requiere atención"}
          trend={data.completedMaintenances > 0 ? "up" : "neutral"}
        />
      </div>
    </section >
  )
}

export default StatsSection
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