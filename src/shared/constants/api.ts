export const API_SEGMENTS = {
  v1: '/api/v1',
} as const

export const API_ENDPOINTS = {
  admin: {
    users: `${API_SEGMENTS.v1}/admin/users`,
  },
  auth: {
    register: `${API_SEGMENTS.v1}/auth/register`,
    verify: `${API_SEGMENTS.v1}/auth/verify`,
    resend: `${API_SEGMENTS.v1}/auth/resend`,
    refresh: `${API_SEGMENTS.v1}/auth/refresh`,
    logout: `${API_SEGMENTS.v1}/auth/logout`,
    me: `${API_SEGMENTS.v1}/auth/me`,
    login: `${API_SEGMENTS.v1}/auth/login`,
  },
  user: {
    me: `${API_SEGMENTS.v1}/user/me`,
  },
} as const
