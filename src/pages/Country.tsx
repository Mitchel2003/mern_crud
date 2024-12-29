import DashboardSkeleton from "#/common/skeletons/DashboardSkeleton"
import CountrySection from "@/sections/country/CountrySection"
import { useThemeContext } from "@/context/ThemeContext"
import { useParams } from "react-router-dom"
import { Suspense } from "react"

const Country = () => {
  const { theme } = useThemeContext()
  const { id } = useParams()

  return (
    <Suspense fallback={<DashboardSkeleton theme={theme} />}>
      <CountrySection theme={theme} id={id} />
    </Suspense>
  )
}

export default Country