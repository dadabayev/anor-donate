import { canAccessAdminPanel } from './admin-access'
import { clearAuthSession, setAuthSession } from '@shared/lib'
import { afterEach, describe, expect, it, vi } from 'vitest'

describe('canAccessAdminPanel', () => {
  afterEach(() => {
    clearAuthSession()
    vi.unstubAllEnvs()
  })

  it('returns false when panel is disabled via env', () => {
    vi.stubEnv('VITE_ADMIN_PANEL_ENABLED', 'false')
    setAuthSession({
      userId: 1,
      username: 'admin',
      role: 'ADMIN',
      accessToken: 'token',
      refreshToken: 'refresh',
    })

    expect(canAccessAdminPanel()).toBe(false)
  })

  it('returns true only for authenticated admin users', () => {
    vi.stubEnv('VITE_ADMIN_PANEL_ENABLED', 'true')
    setAuthSession({
      userId: 1,
      username: 'admin',
      role: 'ADMIN',
      accessToken: 'token',
      refreshToken: 'refresh',
    })

    expect(canAccessAdminPanel()).toBe(true)
  })

  it('returns false for authenticated non-admin users', () => {
    vi.stubEnv('VITE_ADMIN_PANEL_ENABLED', 'true')
    setAuthSession({
      userId: 2,
      username: 'user',
      role: 'USER',
      accessToken: 'token',
      refreshToken: 'refresh',
    })

    expect(canAccessAdminPanel()).toBe(false)
  })
})
