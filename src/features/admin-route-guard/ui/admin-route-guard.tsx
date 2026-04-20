import { canAccessAdminPanel } from '@shared/config'
import { Navigate, Outlet } from 'react-router-dom'

export const AdminRouteGuard = () => {
  if (!canAccessAdminPanel()) {
    return <Navigate replace to="/dashboard" />
  }

  return <Outlet />
}
