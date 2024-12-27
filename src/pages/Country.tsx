import DashboardSkeleton from "#/common/skeletons/DashboardSkeleton"
import CountrySection from "@/sections/country/CountrySection"
import { useThemeContext } from "@/context/ThemeContext"
import { Suspense } from "react"

const Country = () => {
  const { theme } = useThemeContext()
  return (
    <Suspense fallback={<DashboardSkeleton theme={theme} />}>
      <CountrySection theme={theme} />
    </Suspense>
  )
}

export default Country