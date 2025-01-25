import PreviewCurriculumSection from "@/sections/curriculum/PreviewCurriculumSection"
import CurriculumSection from "@/sections/curriculum/CurriculumSection"
import DashboardSkeleton from "#/common/skeletons/DashboardSkeleton"
import { useThemeContext } from "@/context/ThemeContext"
import { useParams } from "react-router-dom"
import { Suspense } from "react"

const Curriculum = () => {
  const { theme } = useThemeContext()
  const { id } = useParams()

  return (
    <Suspense fallback={<DashboardSkeleton theme={theme} />}>
      <CurriculumSection theme={theme} id={id} />
    </Suspense>
  )
}
export default Curriculum
/*---------------------------------------------------------------------------------------------------------*/

/*--------------------------------------------------preview--------------------------------------------------*/
export const PreviewCurriculum = () => {
  const { theme } = useThemeContext()
  const { id } = useParams()

  return (
    <Suspense fallback={<DashboardSkeleton theme={theme} />}>
      <PreviewCurriculumSection theme={theme} id={id as string} />
    </Suspense>
  )
}