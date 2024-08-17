import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext"

function ProtectedRoute() {
  const { isAuth, isLoading } = useAuth();
  if (isLoading) return (<h1> loading... </h1>)
  if (!isLoading && !isAuth) return (<Navigate to='/login' replace />);
  return <Outlet />
}

export default ProtectedRoute