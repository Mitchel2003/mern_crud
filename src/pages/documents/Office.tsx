import OfficeSection from "@/sections/documents/office/OfficeSection"
import { useThemeContext } from "@/context/ThemeContext"
import Skeleton from "#/common/skeletons/SkeletonLarge"
import { useParams } from "react-router-dom"
import { Suspense } from "react"

const Office = () => {
  const { theme } = useThemeContext()
  const { id } = useParams()

  return (
    <Suspense fallback={<Skeleton theme={theme} />}>
      <OfficeSection theme={theme} id={id} />
    </Suspense>
  )
}

export default Office 