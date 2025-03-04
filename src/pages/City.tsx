import Skeleton from "#/common/skeletons/SkeletonLarge"
import { useThemeContext } from "@/context/ThemeContext"
import CitySection from "@/sections/city/CitySection"
import { useParams } from "react-router-dom"
import { Suspense } from "react"

const City = () => {
  const { theme } = useThemeContext()
  const { id } = useParams()

  return (
    <Suspense fallback={<Skeleton theme={theme} />}>
      <CitySection theme={theme} id={id} />
    </Suspense>
  )
}

export default City