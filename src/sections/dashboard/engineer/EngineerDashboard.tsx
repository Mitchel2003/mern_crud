import { EventMaintenance, Equipment } from '@/interfaces/props.interface'
import { ThemeContextProps } from '@/interfaces/context.interface'
import { useAuthContext } from '@/context/AuthContext'
import MaintenanceCalendar from './CalendarSection'
import StatisticsSection from './StatisticsSection'
import EquipmentSection from './EquipmentSection'
import InfoSection from './InfoSection'

interface EngineerDashboardProps extends ThemeContextProps { }
const EngineerDashboard = ({ theme }: EngineerDashboardProps) => {
  const { user } = useAuthContext()
  return (
    <div className="container space-y-10 p-10 mx-auto">
      <InfoSection theme={theme} auth={user} />
      <StatisticsSection theme={theme} />
      <MaintenanceCalendar theme={theme} events={mockEvents} />
      <EquipmentSection theme={theme} equipments={mockEquipments} />
    </div>
  )
}

export default EngineerDashboard

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
    status: 'bueno',
    name: 'dental equipo',
    nextMaintenance: new Date(Date.now() + 24 * 60 * 60 * 1000),
    imageUrl: 'https://firebasestorage.googleapis.com/v0/b/gestionsalud-2003.appspot.com/o/techno%2Fenterprise%2Fmaicolchinchilla.02%40gmail.com%2Fplace%2Fpreview_1?alt=media&token=25b33868-3a1c-4083-aa15-18addb5734be',
  }
]