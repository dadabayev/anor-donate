import { $api } from '@shared/api'
import { API_ENDPOINTS } from '@shared/constants'
import { formatUzbekistanPhoneInput } from '@shared/lib'

export type BloggerStatus = 'active' | 'blocked'

export interface AdminBloggerRow {
  id: string
  number: number
  nickname: string
  fullName: string
  channel: string
  phone: string
  status: BloggerStatus
  username: string
  channelName: string
  channelUrl: string
  email: string
  channelAbout: string
  passwordDisplay: string
}

interface ApiEnvelope<T> {
  data: T
  message: string
  success: boolean
}

interface AdminUsersItemDto {
  userId: number
  username: string
  name: string
  channel: string | null
  phone: string | null
  status: number
}

interface AdminUsersListDto {
  items: AdminUsersItemDto[]
  page: number
  size: number
  totalElements: number
  totalPages: number
  hasNext: boolean
}

export interface AdminBloggersResponse {
  items: AdminBloggerRow[]
  page: number
  size: number
  totalElements: number
  totalPages: number
  hasNext: boolean
}

export const ADMIN_BLOGGERS_PAGE_SIZE = 20

const mapPhone = (value: string | null) => {
  if (!value?.trim()) {
    return '—'
  }
  return formatUzbekistanPhoneInput(value)
}

const mapRow = (
  item: AdminUsersItemDto,
  index: number,
  page: number,
  size: number,
): AdminBloggerRow => {
  const channelUrl = item.channel ?? ''
  const displayName = item.name?.trim() || item.username
  return {
    id: String(item.userId),
    number: page * size + index + 1,
    nickname: item.username,
    fullName: displayName,
    channel: channelUrl,
    phone: mapPhone(item.phone),
    status: item.status === 1 ? 'active' : 'blocked',
    username: item.username,
    channelName: displayName,
    channelUrl,
    email: '',
    channelAbout: '',
    // eslint-disable-next-line sonarjs/no-hardcoded-passwords
    passwordDisplay: '********',
  }
}

export async function fetchAdminBloggers(params: {
  page: number
  size: number
  name: string
}): Promise<AdminBloggersResponse> {
  const response = await $api.get<ApiEnvelope<AdminUsersListDto>>(
    API_ENDPOINTS.admin.users,
    {
      params: {
        page: params.page,
        size: params.size,
        name: params.name || undefined,
      },
    },
  )

  if (!response.data.success) {
    throw new Error(response.data.message || 'Failed to load users')
  }

  const payload = response.data.data
  return {
    items: payload.items.map((item, index) =>
      mapRow(item, index, payload.page, payload.size),
    ),
    page: payload.page,
    size: payload.size,
    totalElements: payload.totalElements,
    totalPages: payload.totalPages,
    hasNext: payload.hasNext,
  }
}
