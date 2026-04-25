import { isAuthenticated } from '@shared/lib'
import { Navigate, Outlet, useLocation } from 'react-router-dom'

export const AuthRouteGuard = () => {
  const location = useLocation()

  if (!isAuthenticated()) {
    return (
      <Navigate replace to="/sign-in" state={{ from: location.pathname }} />
    )
  }

  return <Outlet />
}
