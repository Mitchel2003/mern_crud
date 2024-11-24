import { EventMaintenance, Equipment } from '@/types/task/dashboard.type'
import { ThemeContextProps } from '@/interfaces/context.interface'
import EquipmentSection from '@/sections/dashboard/EquipmentSection'
import StatisticsSection from '@/sections/dashboard/StatisticsSection'
import MaintenanceCalendar from '@/sections/dashboard/CalendarSection'

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

const DashboardSection = ({ theme }: ThemeContextProps) => {
  return (
    <div className="container p-10 mx-auto">
      <StatisticsSection theme={theme} />
      <MaintenanceCalendar events={mockEvents} />
      <EquipmentSection equipments={mockEquipments} />
    </div>
  )
}

export default DashboardSection