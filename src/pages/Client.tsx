import DashboardSkeleton from "#/common/skeletons/DashboardSkeleton"
import ClientSection from "@/sections/client/ClientSection"
import { useThemeContext } from "@/context/ThemeContext"
import { useParams } from "react-router-dom"
import { Suspense } from "react"

const Client = () => {
  const { theme } = useThemeContext()
  const { id } = useParams()

  return (
    <Suspense fallback={<DashboardSkeleton theme={theme} />}>
      <ClientSection theme={theme} id={id} />
    </Suspense>
  )
}

export default Client