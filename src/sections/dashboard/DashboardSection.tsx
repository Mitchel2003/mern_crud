import { EventMaintenance, Equipment } from '@/types/task/dashboard.type'
import { ThemeContextProps } from '@/interfaces/context.interface'
import EquipmentSection from '@/sections/dashboard/EquipmentSection'
import StatisticsSection from '@/sections/dashboard/StatisticsSection'
import MaintenanceCalendar from '@/sections/dashboard/CalendarSection'

// Estos datos deberían venir de una API o un estado global en una aplicación real
const mockEvents: EventMaintenance[] = [
  // ... añadir eventos de ejemplo
]

const mockEquipments: Equipment[] = [
  // ... añadir equipos de ejemplo
]

const DashboardSection = ({ theme }: ThemeContextProps) => {
  return (
    <div className="container p-0 mx-auto">
      <StatisticsSection theme={theme} />
      <MaintenanceCalendar events={mockEvents} />
      <EquipmentSection equipments={mockEquipments} />
    </div>
  )
}

export default DashboardSection