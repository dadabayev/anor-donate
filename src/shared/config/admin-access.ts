/**
 * Gate for `/admin` routes. Set `VITE_ADMIN_PANEL_ENABLED=false` to hard-disable
 * the panel in a build. Replace with a real role/session check when auth exists.
 */
export function canAccessAdminPanel(): boolean {
  return import.meta.env.VITE_ADMIN_PANEL_ENABLED !== 'false'
}
