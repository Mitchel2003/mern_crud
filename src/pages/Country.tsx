import CountrySection from "@/sections/country/CountrySection"
import { useThemeContext } from "@/context/ThemeContext"
import Skeleton from "#/common/skeletons/SkeletonLarge"
import { useParams } from "react-router-dom"
import { Suspense } from "react"

const Country = () => {
  const { theme } = useThemeContext()
  const { id } = useParams()

  return (
    <Suspense fallback={<Skeleton theme={theme} />}>
      <CountrySection theme={theme} id={id} />
    </Suspense>
  )
}

export default Country