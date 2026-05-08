import { $api } from '@shared/api'
import type { ApiEnvelope } from '@shared/api/api-envelope'
import { API_ENDPOINTS } from '@shared/constants'
import { formatAdminDateTime } from '@shared/lib/admin-format'

export type AdminNewsStatus = 'draft' | 'published'

export interface AdminNewsRow {
  id: string
  number: number
  title: string
  body: string
  coverImageUrl: string
  createdAt: string
  status: AdminNewsStatus
}

export const ADMIN_NEWS_PAGE_SIZE = 10

const NEWS_PLACEHOLDER_IMG =
  'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'

interface NewsEntityDto {
  id: number
  title: string
  content: string
  createdAt: string
}

const mapRow = (dto: NewsEntityDto, index: number, coverImageUrl: string): AdminNewsRow => ({
  id: String(dto.id),
  number: index + 1,
  title: dto.title,
  body: dto.content,
  coverImageUrl,
  createdAt: formatAdminDateTime(dto.createdAt),
  status: 'published',
})

export function newsCoverSrc(row: AdminNewsRow): string {
  const t = row.coverImageUrl.trim()
  return t || NEWS_PLACEHOLDER_IMG
}

export async function fetchAdminNews(): Promise<AdminNewsRow[]> {
  const response = await $api.get<ApiEnvelope<NewsEntityDto[]>>(
    API_ENDPOINTS.content.news,
  )

  if (!response.data.success) {
    throw new Error(response.data.message || 'Не удалось загрузить новости')
  }

  const sorted = [...response.data.data].sort(
    (a, b) => Number(b.id) - Number(a.id),
  )

  return sorted.map((dto, index) => mapRow(dto, index, ''))
}

export async function saveAdminNews(input: {
  mode: 'create' | 'edit'
  title: string
  body: string
  /** Обложка только для отображения в UI; на бэкенде не хранится */
  coverImageUrl: string
  rowId: string | null
}): Promise<AdminNewsRow> {
  const payload: { id?: number; title: string; content: string } = {
    title: input.title.trim(),
    content: input.body.trim(),
  }
  if (input.mode === 'edit' && input.rowId) {
    payload.id = Number(input.rowId)
  }

  const response = await $api.post<ApiEnvelope<NewsEntityDto>>(
    API_ENDPOINTS.content.news,
    payload,
  )

  if (!response.data.success) {
    throw new Error(response.data.message || 'Не удалось сохранить новость')
  }

  return mapRow(response.data.data, 0, input.coverImageUrl.trim())
}

export function filterAdminNews(
  rows: AdminNewsRow[],
  query: string,
): AdminNewsRow[] {
  const q = query.trim().toLowerCase()
  if (!q) {
    return rows
  }
  return rows.filter(
    (row) =>
      row.title.toLowerCase().includes(q) ||
      row.body.toLowerCase().includes(q) ||
      row.createdAt.toLowerCase().includes(q),
  )
}

export function nextNewsNumber(rows: AdminNewsRow[]): number {
  let max = 0
  for (const row of rows) {
    if (row.number > max) {
      max = row.number
    }
  }
  return max + 1
}
