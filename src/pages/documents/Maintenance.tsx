import MaintenanceSection from '@/sections/documents/maintenance/MaintenanceSection'
import { createTheme, ThemeProvider } from '@mui/material'
import { useParams, useLocation } from 'react-router-dom'
import { useThemeContext } from '@/context/ThemeContext'
import Skeleton from '#/common/skeletons/SkeletonLarge'
import { Suspense } from 'react'

const Maintenance = () => {
  const { theme } = useThemeContext()
  const location = useLocation()
  const { id } = useParams()

  const filter = new URLSearchParams(location.search).get('filter')
  const table = createTheme({ palette: { mode: theme } })

  return (
    <Suspense fallback={<Skeleton theme={theme} />}>
      <ThemeProvider theme={table}>
        <MaintenanceSection theme={theme} id={filter || id} />
      </ThemeProvider>
    </Suspense>
  )
}

export default Maintenance