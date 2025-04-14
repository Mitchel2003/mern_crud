import ClientFlowSection from "@/sections/flow/client/ClientFlowSection"
import ClientSection from "@/sections/documents/client/ClientSection"
import { createTheme, ThemeProvider } from "@mui/material"
import { useThemeContext } from "@/context/ThemeContext"
import Skeleton from "#/common/skeletons/SkeletonLarge"
import { useParams } from "react-router-dom"
import { Suspense } from "react"

const ClientPage = () => {
  const { theme } = useThemeContext()
  const { id } = useParams()
  const table = createTheme({
    palette: { mode: theme }
  })

  return (
    <Suspense fallback={<Skeleton theme={theme} />}>
      <ThemeProvider theme={table}>
        <ClientSection theme={theme} id={id} />
      </ThemeProvider>
    </Suspense>
  )
}

export default ClientPage
/*---------------------------------------------------------------------------------------------------------*/

/*--------------------------------------------------preview--------------------------------------------------*/
export const ClientFlowPage = () => {
  const { theme } = useThemeContext()

  return (
    <Suspense fallback={<Skeleton theme={theme} />}>
      <ClientFlowSection theme={theme} />
    </Suspense>
  )
}