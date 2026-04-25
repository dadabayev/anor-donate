import { canAccessAdminPanel } from '@shared/config'
import { getCurrentUserRole, getRoleHomePath } from '@shared/lib'
import { Navigate, Outlet } from 'react-router-dom'

export const AdminRouteGuard = () => {
  if (!canAccessAdminPanel()) {
    return <Navigate replace to={getRoleHomePath(getCurrentUserRole())} />
  }

  return <Outlet />
}
