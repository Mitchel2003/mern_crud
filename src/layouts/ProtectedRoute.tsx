import { useThemeContext } from "@/context/ThemeContext"
import Skeleton from "#/common/skeletons/SkeletonLarge"
import { useAuthContext } from "@/context/AuthContext"
import { Navigate, Outlet } from "react-router-dom"

function ProtectedRoute() {
  const { isAuth, loading, user } = useAuthContext()
  const { theme } = useThemeContext()

  if (loading) return <Skeleton theme={theme} />
  if (!loading && !isAuth) return <Navigate to='/auth/login' replace />
  user && !user.fcmToken && getPermissionsNotification(user._id)
  return <Outlet />
}

export default ProtectedRoute
/*---------------------------------------------------------------------------------------------------------*/

/*--------------------------------------------------tools--------------------------------------------------*/
const getPermissionsNotification = async (userId: string) => {
  const permission = await Notification.requestPermission()
  if (permission === "granted") useAuthContext().saveToken(userId)
}