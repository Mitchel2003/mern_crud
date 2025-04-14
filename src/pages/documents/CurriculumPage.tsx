import PreviewCurriculumSection from "@/sections/documents/curriculum/PreviewCurriculumSection"
import CurriculumSection from "@/sections/documents/curriculum/CurriculumSection"
import { createTheme, ThemeProvider } from "@mui/material"
import { useThemeContext } from "@/context/ThemeContext"
import Skeleton from "#/common/skeletons/SkeletonLarge"
import { useIsMobile } from "@/hooks/ui/use-mobile"
import { useParams } from "react-router-dom"
import { Suspense } from "react"

const CurriculumPage = () => {
  const { theme } = useThemeContext()
  const { id } = useParams()
  const table = createTheme({
    palette: { mode: theme }
  })

  return (
    <Suspense fallback={<Skeleton theme={theme} />}>
      <ThemeProvider theme={table}>
        <CurriculumSection theme={theme} id={id} />
      </ThemeProvider>
    </Suspense>
  )
}
export default CurriculumPage
/*---------------------------------------------------------------------------------------------------------*/

/*--------------------------------------------------preview--------------------------------------------------*/
export const PreviewCurriculumPage = () => {
  const { theme } = useThemeContext()
  const { id = '' } = useParams()
  const isMobile = useIsMobile()

  return (
    <Suspense fallback={<Skeleton theme={theme} />}>
      <PreviewCurriculumSection id={id} theme={theme} isMobile={isMobile} />
    </Suspense>
  )
}