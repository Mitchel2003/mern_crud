import MaintenanceSection from '@/sections/maintenance/MaintenanceSection'
import { createTheme, ThemeProvider } from '@mui/material'
import { useThemeContext } from '@/context/ThemeContext'
import Skeleton from '#/common/skeletons/SkeletonLarge'
import { Suspense } from 'react'
import { useParams } from 'react-router-dom'

const Maintenance = () => {
  const { theme } = useThemeContext()
  const { id } = useParams()
  const table = createTheme({
    palette: { mode: theme }
  })

  return (
    <Suspense fallback={<Skeleton theme={theme} />}>
      <ThemeProvider theme={table}>
        <MaintenanceSection theme={theme} id={id} />
      </ThemeProvider>
    </Suspense>
  )
}

export default Maintenance