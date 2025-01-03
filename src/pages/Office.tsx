import DashboardSkeleton from "#/common/skeletons/DashboardSkeleton"
import { useThemeContext } from "@/context/ThemeContext"
import OfficeSection from "@/sections/office/OfficeSection"
import { useParams } from "react-router-dom"
import { Suspense } from "react"

const Office = () => {
  const { theme } = useThemeContext()
  const { id } = useParams()

  return (
    <Suspense fallback={<DashboardSkeleton theme={theme} />}>
      <OfficeSection theme={theme} id={id} />
    </Suspense>
  )
}

export default Office 