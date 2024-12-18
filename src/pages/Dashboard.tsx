import EngineerDashboard from '@/sections/dashboard/engineer/EngineerDashboard'
import AdminDashboard from '@/sections/dashboard/admin/AdminDashboard'
import DashboardSkeleton from '#/common/skeletons/DashboardSkeleton'
import { useThemeContext } from '@/context/ThemeContext'
import { useAuthContext } from '@/context/AuthContext'
import { Suspense } from 'react'

const Dashboard = () => {
  const { theme } = useThemeContext()
  const { user } = useAuthContext()

  return (
    <Suspense fallback={<DashboardSkeleton theme={theme} />}>
      {user?.role === 'admin'
        ? <AdminDashboard theme={theme} />
        : <EngineerDashboard theme={theme} />
      }
    </Suspense>
  )
}

export default Dashboard