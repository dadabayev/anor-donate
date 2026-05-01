import { API_ENDPOINTS } from '@shared/constants'
import {
  clearAuthSession,
  getAccessToken,
  getAuthSession,
  setAuthSession,
} from '@shared/lib'
import type { AxiosError, InternalAxiosRequestConfig } from 'axios'
import axios from 'axios'

interface ApiEnvelope<T> {
  data: T
  message: string
  success: boolean
}

interface RefreshResponseDto {
  userId: number
  username: string
  role: 'ADMIN' | 'USER'
  accessToken: string
  refreshToken: string
}

interface RetriableRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean
  skipAuthRefresh?: boolean
}

export const $api = axios.create({
  baseURL: 'https://api.a-d.theuzsoft.uz',
})

let refreshPromise: Promise<string | null> | null = null

const redirectToSignIn = () => {
  if (typeof window === 'undefined') {
    return
  }

  if (window.location.pathname !== '/sign-in') {
    window.location.assign('/sign-in')
  }
}

const refreshAccessToken = async (): Promise<string | null> => {
  const session = getAuthSession()
  if (!session?.refreshToken) {
    return null
  }

  try {
    const response = await axios.post<ApiEnvelope<RefreshResponseDto>>(
      `${import.meta.env.VITE_APP_API_URL}${API_ENDPOINTS.auth.refresh}`,
      {
        refreshToken: session.refreshToken,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    )

    if (!response.data.success || !response.data.data.accessToken) {
      return null
    }

    const refreshedSession = {
      userId: response.data.data.userId,
      username: response.data.data.username,
      role: response.data.data.role,
      accessToken: response.data.data.accessToken,
      refreshToken: response.data.data.refreshToken,
    }
    setAuthSession(refreshedSession)

    return refreshedSession.accessToken
  } catch {
    return null
  }
}

$api.interceptors.request.use((config) => {
  const token = getAccessToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

$api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const statusCode = error.response?.status
    const originalRequest = error.config as RetriableRequestConfig | undefined

    if (!originalRequest) {
      return Promise.reject(error)
    }

    if (statusCode === 403) {
      clearAuthSession()
      redirectToSignIn()
      return Promise.reject(error)
    }

    if (
      statusCode !== 401 ||
      originalRequest._retry ||
      originalRequest.skipAuthRefresh
    ) {
      return Promise.reject(error)
    }

    if (!refreshPromise) {
      refreshPromise = refreshAccessToken().finally(() => {
        refreshPromise = null
      })
    }

    const nextAccessToken = await refreshPromise
    if (!nextAccessToken) {
      clearAuthSession()
      redirectToSignIn()
      return Promise.reject(error)
    }

    originalRequest._retry = true
    originalRequest.headers.Authorization = `Bearer ${nextAccessToken}`
    return $api(originalRequest)
  },
)
