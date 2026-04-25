export type AuthRole = 'ADMIN' | 'USER'

export interface AuthSession {
  userId: number
  username: string
  role: AuthRole
  accessToken: string
  refreshToken: string
}

const AUTH_SESSION_STORAGE_KEY = 'anor.auth.session'

const hasWindow = () => typeof window !== 'undefined'

export const getAuthSession = (): AuthSession | null => {
  if (!hasWindow()) {
    return null
  }

  const rawValue = window.localStorage.getItem(AUTH_SESSION_STORAGE_KEY)
  if (!rawValue) {
    return null
  }

  try {
    const parsed = JSON.parse(rawValue) as Partial<AuthSession>
    if (
      typeof parsed.userId !== 'number' ||
      typeof parsed.username !== 'string' ||
      (parsed.role !== 'ADMIN' && parsed.role !== 'USER') ||
      typeof parsed.accessToken !== 'string' ||
      typeof parsed.refreshToken !== 'string'
    ) {
      return null
    }

    return parsed as AuthSession
  } catch {
    return null
  }
}

export const setAuthSession = (session: AuthSession) => {
  if (!hasWindow()) {
    return
  }

  window.localStorage.setItem(AUTH_SESSION_STORAGE_KEY, JSON.stringify(session))
}

export const clearAuthSession = () => {
  if (!hasWindow()) {
    return
  }

  window.localStorage.removeItem(AUTH_SESSION_STORAGE_KEY)
}

export const isAuthenticated = () => Boolean(getAuthSession()?.accessToken)

export const getAccessToken = () => getAuthSession()?.accessToken ?? null

export const getRefreshToken = () => getAuthSession()?.refreshToken ?? null

export const getCurrentUserRole = () => getAuthSession()?.role ?? null

export const getRoleHomePath = (role: AuthRole | null) => {
  if (role === 'ADMIN') {
    return '/admin'
  }

  return '/dashboard'
}
