import MaintenanceSection from '@/sections/maintenance/MaintenanceSection'
import { useThemeContext } from '@/context/ThemeContext'

const MaintenanceForm = () => {
  const { theme } = useThemeContext()

  return (
    <div className="w-full py-10">
      <MaintenanceSection theme={theme} />
    </div>
  )
}

export default MaintenanceForm