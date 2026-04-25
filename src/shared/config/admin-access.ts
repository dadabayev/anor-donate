import { getCurrentUserRole, isAuthenticated } from '@shared/lib'

/**
 * Gate for `/admin` routes. Set `VITE_ADMIN_PANEL_ENABLED=false` to hard-disable
 * the panel in a build.
 */
export function canAccessAdminPanel(): boolean {
  if (import.meta.env.VITE_ADMIN_PANEL_ENABLED === 'false') {
    return false
  }

  return isAuthenticated() && getCurrentUserRole() === 'ADMIN'
}
