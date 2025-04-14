import CountrySection from "@/sections/documents/country/CountrySection"
import { createTheme, ThemeProvider } from '@mui/material'
import { useThemeContext } from "@/context/ThemeContext"
import Skeleton from "#/common/skeletons/SkeletonLarge"
import { useParams } from "react-router-dom"
import { Suspense } from "react"

const CountryPage = () => {
  const { theme } = useThemeContext()
  const { id } = useParams()
  const table = createTheme({
    palette: { mode: theme }
  })

  return (
    <Suspense fallback={<Skeleton theme={theme} />}>
      <ThemeProvider theme={table}>
        <CountrySection theme={theme} id={id} />
      </ThemeProvider>
    </Suspense>
  )
}

export default CountryPage