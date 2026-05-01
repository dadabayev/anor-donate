import { $api } from './api-client'
import { API_ENDPOINTS } from '@shared/constants'

export interface ApiEnvelope<T> {
  data: T
  message: string
  success: boolean
}

export interface UserMeAccountDto {
  id: number
  username: string
  role: string
  status: number
  createdAt: string
  updatedAt: string
  deletedAt: string | null
}

export interface UserMeProfileDto {
  userId: number
  displayName: string
  firstName: string
  lastName: string
  nameModeration: boolean
  photoPath: string | null
  phoneE164: string | null
  email: string | null
  telegramId: string | null
  channelName: string | null
  channelUrl: string | null
  channelDescription: string | null
  channelScreenshotPath: string | null
  pendingPhoneE164: string | null
  pendingChannelUrl: string | null
  verifiedPhotoPath: string | null
  socialLinksJson: unknown
  createdAt: string
  updatedAt: string
}

export interface UserMeDataDto {
  account: UserMeAccountDto
  profile: UserMeProfileDto
  preferences: unknown
}

export const fetchUserMe = async (): Promise<UserMeDataDto> => {
  const response = await $api.get<ApiEnvelope<UserMeDataDto>>(
    API_ENDPOINTS.user.me,
  )

  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.message || 'Failed to load user profile')
  }

  return response.data.data
}
