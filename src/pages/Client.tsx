import ClientFlowSection from "@/sections/flow/client/ClientFlowSection"
import ClientSection from "@/sections/client/ClientSection"
import { useThemeContext } from "@/context/ThemeContext"
import Skeleton from "#/common/skeletons/SkeletonLarge"
import { useParams } from "react-router-dom"
import { Suspense } from "react"

const Client = () => {
  const { theme } = useThemeContext()
  const { id } = useParams()

  return (
    <Suspense fallback={<Skeleton theme={theme} />}>
      <ClientSection theme={theme} id={id} />
    </Suspense>
  )
}

export default Client
/*---------------------------------------------------------------------------------------------------------*/

/*--------------------------------------------------preview--------------------------------------------------*/
export const ClientFlow = () => {
  const { theme } = useThemeContext()

  return (
    <Suspense fallback={<Skeleton theme={theme} />}>
      <ClientFlowSection theme={theme} />
    </Suspense>
  )
}