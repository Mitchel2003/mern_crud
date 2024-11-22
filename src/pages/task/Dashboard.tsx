import DashboardSection from '@/sections/task/dashboard/DashboardSection'
import { useThemeContext } from '@/context/ThemeContext'

const Dashboard = () => {
  const { theme } = useThemeContext()
  return <DashboardSection theme={theme} />
}

export default Dashboard