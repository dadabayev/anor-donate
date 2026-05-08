import { $api } from '@shared/api'
import type { ApiEnvelope } from '@shared/api/api-envelope'
import { API_ENDPOINTS } from '@shared/constants'
import { formatUzbekistanPhoneInput } from '@shared/lib'

import type { AdminBloggerRow } from './admin-bloggers'
import type { AdminUsersItemDto, AdminUsersListDto } from './admin-users-types'

export interface AdminModerationRow extends AdminBloggerRow {
  channelThumbUrl: string | null
}

export const ADMIN_MODERATION_PAGE_SIZE = 10

const mapPhone = (value: string | null) => {
  if (!value?.trim()) {
    return '—'
  }
  return formatUzbekistanPhoneInput(value)
}

const mapPendingRow = (
  item: AdminUsersItemDto,
  index: number,
): AdminModerationRow => {
  const channelUrl = item.channel ?? ''
  const displayName = item.name?.trim() || item.username
  return {
    id: String(item.userId),
    number: index + 1,
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
    channelThumbUrl: null,
  }
}

export async function fetchAdminModeration(): Promise<AdminModerationRow[]> {
  const size = 500
  const response = await $api.get<ApiEnvelope<AdminUsersListDto>>(
    API_ENDPOINTS.admin.users,
    {
      params: { page: 0, size },
    },
  )

  if (!response.data.success) {
    throw new Error(response.data.message || 'Не удалось загрузить очередь')
  }

  const pending = response.data.data.items.filter((u) => u.status !== 1)

  return pending.map((item, index) => mapPendingRow(item, index))
}

export function filterModerationRows(
  rows: AdminModerationRow[],
  query: string,
): AdminModerationRow[] {
  const q = query.trim().toLowerCase()
  if (!q) {
    return rows
  }
  return rows.filter((row) => {
    return (
      row.nickname.toLowerCase().includes(q) ||
      row.fullName.toLowerCase().includes(q) ||
      row.channel.toLowerCase().includes(q) ||
      row.phone.toLowerCase().includes(q) ||
      row.email.toLowerCase().includes(q)
    )
  })
}
