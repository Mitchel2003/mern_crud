import EngineerSection from '@/sections/dashboard/engineer/EngineerSection'
import ClientSection from '@/sections/dashboard/client/ClientSection'
import AdminSection from '@/sections/dashboard/admin/AdminSection'
import Skeleton from '#/common/skeletons/SkeletonLarge'
import { useThemeContext } from '@/context/ThemeContext'
import { useAuthContext } from '@/context/AuthContext'
import { Suspense } from 'react'

const Dashboard = () => {
  const { theme } = useThemeContext()
  const { user } = useAuthContext()
  return (
    <Suspense fallback={<Skeleton theme={theme} />}>
      {user?.role === 'client'
        ? <ClientSection theme={theme} />
        : (user?.role === 'engineer'
          ? <EngineerSection theme={theme} />
          : <AdminSection theme={theme} />)
      }
    </Suspense>
  )
}

export default Dashboard