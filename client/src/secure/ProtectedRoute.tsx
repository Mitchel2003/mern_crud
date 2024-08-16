import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext"

function ProtectedRoute () {
  const { isAuth } = useAuth();
  if (!isAuth) return (<Navigate to='/login' replace />);
  return <Outlet />
}

export default ProtectedRoute