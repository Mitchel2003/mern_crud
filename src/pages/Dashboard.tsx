import DashboardSection from '@/sections/dashboard/DashboardSection'
import { useCurriculumContext } from '@/context/CurriculumContext'
import { useThemeContext } from '@/context/ThemeContext'
import { useAuthContext } from '@/context/AuthContext'

const Dashboard = () => {
  const { curriculums } = useCurriculumContext()
  const { theme } = useThemeContext()
  const { user } = useAuthContext()

  return <DashboardSection theme={theme} auth={user} />
}

export default Dashboard