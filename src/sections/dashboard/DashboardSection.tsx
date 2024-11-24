import { EventMaintenance, Equipment } from '@/types/task/dashboard.type'
import { ThemeContextProps, User } from '@/interfaces/context.interface'
import MaintenanceCalendar from './CalendarSection'
import StatisticsSection from './StatisticsSection'
import EquipmentSection from './EquipmentSection'
import InfoSection from './InfoSection'

interface DashboardSectionProps extends ThemeContextProps { auth: User }
const DashboardSection = ({ theme, auth }: DashboardSectionProps) => {
  return (
    <div className="container p-5 mx-auto">
      <InfoSection theme={theme} auth={auth} />
      <StatisticsSection theme={theme} />
      <MaintenanceCalendar events={mockEvents} />
      <EquipmentSection equipments={mockEquipments} />
    </div>
  )
}

export default DashboardSection

// Estos datos deberían venir de una API o un estado global en una aplicación real
const mockEvents: EventMaintenance[] = [
  {
    id: '1',
    importance: 'critical',
    date: new Date(Date.now() + 48 * 60 * 60 * 1000),
    description: 'equipo en proceso de mantenimiento'
  }
]

const mockEquipments: Equipment[] = [
  {
    id: '1',
    imageUrl: '',
    status: 'bueno',
    name: 'dental equipo',
    nextMaintenance: new Date(Date.now() + 24 * 60 * 60 * 1000)
  }
]