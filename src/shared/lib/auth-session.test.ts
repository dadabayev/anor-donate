import {
  clearAuthSession,
  getAuthSession,
  getRoleHomePath,
  isAuthenticated,
  setAuthSession,
} from './auth-session'
import { afterEach, describe, expect, it } from 'vitest'

describe('auth-session', () => {
  afterEach(() => {
    clearAuthSession()
  })

  it('stores and retrieves auth session from localStorage', () => {
    setAuthSession({
      userId: 10,
      username: 'tester',
      role: 'USER',
      accessToken: 'access-token',
      refreshToken: 'refresh-token',
    })

    expect(getAuthSession()).toEqual({
      userId: 10,
      username: 'tester',
      role: 'USER',
      accessToken: 'access-token',
      refreshToken: 'refresh-token',
    })
    expect(isAuthenticated()).toBe(true)
  })

  it('clears auth session from localStorage', () => {
    setAuthSession({
      userId: 1,
      username: 'admin',
      role: 'ADMIN',
      accessToken: 'token',
      refreshToken: 'refresh',
    })

    clearAuthSession()

    expect(getAuthSession()).toBeNull()
    expect(isAuthenticated()).toBe(false)
  })

  it('returns role-based home path', () => {
    expect(getRoleHomePath('ADMIN')).toBe('/admin')
    expect(getRoleHomePath('USER')).toBe('/dashboard')
    expect(getRoleHomePath(null)).toBe('/dashboard')
  })
})
