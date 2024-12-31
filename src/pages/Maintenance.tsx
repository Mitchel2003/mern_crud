import MaintenanceSection from '@/sections/maintenance/MaintenanceSection'
import DashboardSkeleton from '#/common/skeletons/DashboardSkeleton'
import { useThemeContext } from '@/context/ThemeContext'
import { Suspense } from 'react'
import { useParams } from 'react-router-dom'

const MaintenanceForm = () => {
  const { theme } = useThemeContext()
  const { id } = useParams()

  return (
    <Suspense fallback={<DashboardSkeleton theme={theme} />}>
      <MaintenanceSection theme={theme} id={id} />
    </Suspense>
  )
}

export default MaintenanceForm