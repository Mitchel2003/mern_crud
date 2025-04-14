import SolicitSection from "@/sections/documents/solicit/SolicitSection"
import { createTheme, ThemeProvider } from "@mui/material"
import { useThemeContext } from "@/context/ThemeContext"
import Skeleton from "#/common/skeletons/SkeletonLarge"
import { useAuthContext } from "@/context/AuthContext"
import { useParams } from "react-router-dom"
import { Suspense } from "react"

const SolicitPage = () => {
  const { theme } = useThemeContext()
  const { user } = useAuthContext()
  const { id } = useParams()
  const table = createTheme({
    palette: { mode: theme }
  })

  return (
    <Suspense fallback={<Skeleton theme={theme} />}>
      <ThemeProvider theme={table}>
        <SolicitSection theme={theme} id={id} credentials={user!} />
      </ThemeProvider>
    </Suspense>
  )
}

export default SolicitPage