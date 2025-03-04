import MaintenanceSection from '@/sections/maintenance/MaintenanceSection'
import { useThemeContext } from '@/context/ThemeContext'
import Skeleton from '#/common/skeletons/SkeletonLarge'
import { Suspense } from 'react'
import { useParams } from 'react-router-dom'

const Maintenance = () => {
  const { theme } = useThemeContext()
  const { id } = useParams()

  return (
    <Suspense fallback={<Skeleton theme={theme} />}>
      <MaintenanceSection theme={theme} id={id} />
    </Suspense>
  )
}

export default Maintenance