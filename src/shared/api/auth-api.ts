import { $api } from './api-client'
import { API_ENDPOINTS } from '@shared/constants'
import { getRefreshToken } from '@shared/lib'

export const performLogout = async () => {
  const refreshToken = getRefreshToken()
  if (!refreshToken) {
    return
  }

  try {
    await $api.post(
      API_ENDPOINTS.auth.logout,
      { refreshToken },
      { skipAuthRefresh: true },
    )
  } catch {
    // Ignore API errors and always continue local sign-out.
  }
}
