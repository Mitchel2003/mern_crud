import { getRoutePermission } from "@/constants/routes.constants"
import { Navigate, Outlet, useLocation } from "react-router-dom"
import Unauthorized from "#/common/skeletons/Unautorized"
import { useThemeContext } from "@/context/ThemeContext"
import Skeleton from "#/common/skeletons/SkeletonLarge"
import { useAuthContext } from "@/context/AuthContext"
import { useEffect, useMemo, useState } from "react"

/**
 * Proporciona protección de rutas con las siguientes capas:
 * 1. Autenticación - Verifica si el usuario ha iniciado sesión
 * 2. Autorización por rol - Valida si el usuario tiene un rol permitido para la ruta
 * Utiliza la configuración centralizada de permisos definida en routePermissions.ts
 */
function ProtectedRoute() {
  const [authorized, setAuthorized] = useState<boolean | null>(null)
  const [showSkeleton, setShowSkeleton] = useState<boolean>(true)
  const hasToken = localStorage.getItem('token') !== null
  const { isAuth, user, loading } = useAuthContext()
  const { theme } = useThemeContext()
  const location = useLocation()

  const role = useMemo(() => { //to handle access through role
    if (!user?.role) return undefined //in case of dont exist auth
    return user.role === 'company' ? (user?.belongsTo ? 'company:sub' : 'company:main') : user.role
  }, [user])

  useEffect(() => { //handler authentication
    if (!hasToken) return setShowSkeleton(false)
    if (loading) { //if token exists but still loading, give time auth
      const timeoutId = setTimeout(() => setShowSkeleton(false), 3000)
      return () => clearTimeout(timeoutId)
    } else { setShowSkeleton(false) }
  }, [loading, hasToken])

  useEffect(() => { //handler authorization
    if (!isAuth || loading) return
    const routeConfig = getRoutePermission(location.pathname)
    if (!routeConfig) return setAuthorized(true) //public route
    const hasRole = user && routeConfig.allowed.includes(role)
    if (hasRole !== undefined) setAuthorized(hasRole === true)
    else setAuthorized(false) //deny access (default)
  }, [location.pathname, loading, user])

  if ((loading || authorized === null) && showSkeleton) return <Skeleton theme={theme} />
  if (!isAuth) return <Navigate to='/auth/login' replace />
  if (!authorized) return <Unauthorized theme={theme} />
  return <Outlet />
}

export default ProtectedRoute