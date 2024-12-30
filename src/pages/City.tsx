import DashboardSkeleton from "#/common/skeletons/DashboardSkeleton"
import { useThemeContext } from "@/context/ThemeContext"
import CitySection from "@/sections/city/CitySection"
import { useParams } from "react-router-dom"
import { Suspense } from "react"

const City = () => {
  const { theme } = useThemeContext()
  const { id } = useParams()

  return (
    <Suspense fallback={<DashboardSkeleton theme={theme} />}>
      <CitySection theme={theme} id={id} />
    </Suspense>
  )
}

export default City