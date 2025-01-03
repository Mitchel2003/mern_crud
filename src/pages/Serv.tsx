import DashboardSkeleton from "#/common/skeletons/DashboardSkeleton"
import { useThemeContext } from "@/context/ThemeContext"
import ServiceSection from "@/sections/serv/ServiceSection"
import { useParams } from "react-router-dom"
import { Suspense } from "react"

const Service = () => {
  const { theme } = useThemeContext()
  const { id } = useParams()

  return (
    <Suspense fallback={<DashboardSkeleton theme={theme} />}>
      <ServiceSection theme={theme} id={id} />
    </Suspense>
  )
}

export default Service