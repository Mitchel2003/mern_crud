import CitySection from "@/sections/documents/city/CitySection"
import { createTheme, ThemeProvider } from "@mui/material"
import { useThemeContext } from "@/context/ThemeContext"
import Skeleton from "#/common/skeletons/SkeletonLarge"
import { useParams } from "react-router-dom"
import { Suspense } from "react"

const CityPage = () => {
  const { theme } = useThemeContext()
  const { id } = useParams()
  const table = createTheme({
    palette: { mode: theme }
  })

  return (
    <Suspense fallback={<Skeleton theme={theme} />}>
      <ThemeProvider theme={table}>
        <CitySection theme={theme} id={id} />
      </ThemeProvider>
    </Suspense>
  )
}

export default CityPage