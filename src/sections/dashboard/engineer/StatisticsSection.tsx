import { ThemeContextProps } from '@/interfaces/context.interface'
import StatCard from '#/pages/dashboard/engineer/StatsCard'
import { CircleCheck, CircleX, Users } from 'lucide-react'
import { cn } from '@/lib/utils'

const StatisticsSection = ({ theme }: ThemeContextProps) => {
  return (
    <div className={cn('grid grid-cols-1 md:grid-cols-3 gap-4')}>
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