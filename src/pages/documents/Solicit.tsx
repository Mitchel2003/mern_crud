import SolicitSection from "@/sections/documents/solicit/SolicitSection"
import { useThemeContext } from "@/context/ThemeContext"
import Skeleton from "#/common/skeletons/SkeletonLarge"
import { useParams } from "react-router-dom"
import { Suspense } from "react"

const Solicit = () => {
  const { theme } = useThemeContext()
  const { id } = useParams()

  return (
    <Suspense fallback={<Skeleton theme={theme} />}>
      <SolicitSection theme={theme} id={id} />
    </Suspense>
  )
}

export default Solicit