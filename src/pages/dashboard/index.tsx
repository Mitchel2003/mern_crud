import { useThemeContext } from '@/context/ThemeContext'
import Skeleton from '#/common/skeletons/SkeletonLarge'
import { useAuthContext } from '@/context/AuthContext'
import EngineerSection from './engineer/EngineerPage'
import ClientSection from './client/ClientPage'
import AdminSection from './admin/AdminPage'
import { Suspense } from 'react'

const DashboardPage = () => {
  const { theme } = useThemeContext()
  const { user } = useAuthContext()
  return (
    <Suspense fallback={<Skeleton theme={theme} />}>
      {user?.role === 'client'
        ? <ClientSection />
        : user?.role === 'engineer'
          ? <EngineerSection />
          : <AdminSection />
      }
    </Suspense>
  )
}

export default DashboardPage