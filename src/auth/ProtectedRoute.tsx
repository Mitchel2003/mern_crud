import { useThemeContext } from "@/context/ThemeContext";
import Skeleton from "#/common/skeletons/SkeletonLarge";
import { useAuthContext } from "@/context/AuthContext"
import { Navigate, Outlet } from "react-router-dom";

function ProtectedRoute() {
  const { isAuth, loading } = useAuthContext();
  const { theme } = useThemeContext()

  if (loading) return <Skeleton theme={theme} />
  if (!loading && !isAuth) return <Navigate to='/auth/login' replace />
  return <Outlet />
}

export default ProtectedRoute