import DashboardSkeleton from "#/common/skeletons/DashboardSkeleton"
import { useThemeContext } from "@/context/ThemeContext"
import AreaSection from "@/sections/area/AreaSection"
import { useParams } from "react-router-dom"
import { Suspense } from "react"

const Area = () => {
  const { theme } = useThemeContext()
  const { id } = useParams()

  return (
    <Suspense fallback={<DashboardSkeleton theme={theme} />}>
      <AreaSection theme={theme} id={id} />
    </Suspense>
  )
}

export default Area 