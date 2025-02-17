import DashboardSkeleton from "#/common/skeletons/DashboardSkeleton"
import CompanySection from "@/sections/company/CompanySection"
import { useThemeContext } from "@/context/ThemeContext"
import { useParams } from "react-router-dom"
import { Suspense } from "react"

const Company = () => {
  const { theme } = useThemeContext()
  const { id } = useParams()

  return (
    <Suspense fallback={<DashboardSkeleton theme={theme} />}>
      <CompanySection theme={theme} id={id} />
    </Suspense>
  )
}

export default Company