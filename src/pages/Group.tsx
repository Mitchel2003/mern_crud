import DashboardSkeleton from "#/common/skeletons/DashboardSkeleton"
import GroupSection from "@/sections/group/GroupSection"
import { useThemeContext } from "@/context/ThemeContext"
import { useParams } from "react-router-dom"
import { Suspense } from "react"

const Group = () => {
  const { theme } = useThemeContext()
  const { id } = useParams()

  return (
    <Suspense fallback={<DashboardSkeleton theme={theme} />}>
      <GroupSection theme={theme} id={id} />
    </Suspense>
  )
}

export default Group