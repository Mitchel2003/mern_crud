import DashboardSkeleton from "#/common/skeletons/DashboardSkeleton";
import { useThemeContext } from "@/context/ThemeContext";
import { useAuthContext } from "@/context/AuthContext"
import { Navigate, Outlet } from "react-router-dom";

function ProtectedRoute() {
  const { isAuth, loading } = useAuthContext();
  const { theme } = useThemeContext()

  if (loading) return (<DashboardSkeleton theme={theme} />)
  if (!loading && !isAuth) return (<Navigate to='/auth/login' replace />);
  return <Outlet />
}

export default ProtectedRoute