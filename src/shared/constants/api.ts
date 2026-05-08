export const API_SEGMENTS = {
  v1: '/api/v1',
} as const

export const API_ENDPOINTS = {
  admin: {
    users: `${API_SEGMENTS.v1}/admin/users`,
  },
  content: {
    memeCategories: `${API_SEGMENTS.v1}/content/meme-categories`,
    memes: `${API_SEGMENTS.v1}/content/memes`,
    news: `${API_SEGMENTS.v1}/content/news`,
  },
  home: {
    admin: `${API_SEGMENTS.v1}/home/admin`,
  },
  moderation: {
    globalWords: `${API_SEGMENTS.v1}/moderation/global-words`,
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
