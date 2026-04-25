import {
  getCurrentUserRole,
  getRoleHomePath,
  isAuthenticated,
} from '@shared/lib'
import { Navigate, Outlet } from 'react-router-dom'

export const GuestRouteGuard = () => {
  if (isAuthenticated()) {
    return <Navigate replace to={getRoleHomePath(getCurrentUserRole())} />
  }

  return <Outlet />
}
