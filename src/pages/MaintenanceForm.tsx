import MaintenanceSection from '@/sections/maintenance/MaintenanceSection'
import { useThemeContext } from '@/context/ThemeContext'

const MaintenanceForm = () => {
  const { theme } = useThemeContext()

  return (
    <MaintenanceSection theme={theme} />
  )
}

export default MaintenanceForm