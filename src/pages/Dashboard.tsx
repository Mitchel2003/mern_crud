import DashboardSection from '@/sections/dashboard/DashboardSection'
import { useThemeContext } from '@/context/ThemeContext'
import { useAuthContext } from '@/context/AuthContext'

const Dashboard = () => {
  const { theme } = useThemeContext()
  const { user } = useAuthContext()

  return <DashboardSection theme={theme} auth={user} />
}

export default Dashboard