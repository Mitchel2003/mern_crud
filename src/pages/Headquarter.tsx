import DashboardSkeleton from "#/common/skeletons/DashboardSkeleton"
import { useThemeContext } from "@/context/ThemeContext"
import HeadquarterSection from "@/sections/headquarter/HeadquarterSection"
import { useParams } from "react-router-dom"
import { Suspense } from "react"

const Headquarter = () => {
  const { theme } = useThemeContext()
  const { id } = useParams()

  return (
    <Suspense fallback={<DashboardSkeleton theme={theme} />}>
      <HeadquarterSection theme={theme} id={id} />
    </Suspense>
  )
}

export default Headquarter 