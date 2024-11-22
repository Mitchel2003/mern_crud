import { ThemeContextProps } from '@/interfaces/context.interface'
import { CircleCheck, CircleX, Users } from 'lucide-react'
import StatCard from '#/task/dashboard/StatsCard'

const StatisticsSection = ({ theme }: ThemeContextProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {stats.map((stat, index) => (
        <StatCard
          key={index}
          theme={theme}
          icon={stat.icon}
          title={stat.title}
          value={stat.value}
        />
      ))}
    </div>
  )
}

export default StatisticsSection

const stats = [
  { icon: <Users />, title: 'Clientes', value: '2' },
  { icon: <CircleCheck />, title: 'Equipos Activos', value: '20' },
  { icon: <CircleX />, title: 'Equipos Inactivos', value: '1' }
]