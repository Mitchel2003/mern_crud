import DashboardSkeleton from "#/common/skeletons/DashboardSkeleton"
import StateSection from "@/sections/state/StateSection"
import { useThemeContext } from "@/context/ThemeContext"
import { useParams } from "react-router-dom"
import { Suspense } from "react"

const State = () => {
  const { theme } = useThemeContext()
  const { id } = useParams()

  return (
    <Suspense fallback={<DashboardSkeleton theme={theme} />}>
      <StateSection theme={theme} id={id} />
    </Suspense>
  )
}

export default State