import DashboardSkeleton from "#/common/skeletons/DashboardSkeleton"
import { useThemeContext } from "@/context/ThemeContext"
import StaffSection from "@/sections/staff/StaffSection"
import { useParams } from "react-router-dom"
import { Suspense } from "react"

const Staff = () => {
  const { theme } = useThemeContext()
  const { id } = useParams()

  return (
    <Suspense fallback={<DashboardSkeleton theme={theme} />}>
      <StaffSection theme={theme} id={id} />
    </Suspense>
  )
}

export default Staff