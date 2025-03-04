import PreviewCurriculumSection from "@/sections/curriculum/PreviewCurriculumSection"
import CurriculumSection from "@/sections/curriculum/CurriculumSection"
import { type Curriculum } from "@/interfaces/context.interface"
import { useThemeContext } from "@/context/ThemeContext"
import Skeleton from "#/common/skeletons/SkeletonLarge"
import { useParams } from "react-router-dom"
import { Suspense } from "react"

const Curriculum = () => {
  const { theme } = useThemeContext()
  const { id } = useParams()

  return (
    <Suspense fallback={<Skeleton theme={theme} />}>
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
    <Suspense fallback={<Skeleton theme={theme} />}>
      <PreviewCurriculumSection theme={theme} id={id as string} />
    </Suspense>
  )
}