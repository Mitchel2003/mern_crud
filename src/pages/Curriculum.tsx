import { Accessory, Curriculum as CurriculumType, Inspection } from "@/interfaces/context.interface"
import PreviewCurriculumSection from "@/sections/curriculum/PreviewCurriculumSection"
import CurriculumSection from "@/sections/curriculum/CurriculumSection"
import DashboardSkeleton from "#/common/skeletons/DashboardSkeleton"
import { useQueryFormat } from "@/hooks/query/useFormatQuery"
import { useThemeContext } from "@/context/ThemeContext"
import { Metadata } from "@/interfaces/db.interface"
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

export const PreviewCurriculum = () => {
  const { theme } = useThemeContext()
  const { id = '' } = useParams()

  // Obtener el curriculum por id
  const { fetchFormatById, fetchAllFiles, fetchFormatByQuery } = useQueryFormat()
  const { data: files } = fetchAllFiles<Metadata>('file', { id, ref: 'preview' })
  const { data: acc } = fetchFormatByQuery<Accessory>('accessory', id)
  const { data: ins } = fetchFormatById<Inspection>('inspection', id)
  const { data: cv } = fetchFormatById<CurriculumType>('cv', id)

  return (
    <Suspense fallback={<DashboardSkeleton theme={theme} />}>
      <PreviewCurriculumSection
        accessories={acc}
        inspection={ins}
        curriculum={cv}
        files={files}
      />
    </Suspense>
  )
}