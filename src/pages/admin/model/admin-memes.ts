import { $api } from '@shared/api'
import type { ApiEnvelope } from '@shared/api/api-envelope'
import { API_ENDPOINTS } from '@shared/constants'
import { formatDurationMmSs, parseDurationToSeconds } from '@shared/lib/admin-format'

export type AdminMemeStatus = 'active' | 'inactive'

export interface AdminMemeRow {
  id: string
  number: number
  categoryId: string
  categoryName: string
  name: string
  videoThumbUrl: string
  duration: string
  status: AdminMemeStatus
}

export const ADMIN_MEME_PAGE_SIZE = 10

interface MemeEntityDto {
  id: number
  ownerUserId?: number | null
  memeCategoryId: number | null
  name: string
  path: string
  durationSec: number
  isActive: boolean
}

const mapRow = (
  dto: MemeEntityDto,
  index: number,
  categoryNameById: Map<string, string>,
): AdminMemeRow => ({
  id: String(dto.id),
  number: index + 1,
  categoryId: dto.memeCategoryId != null ? String(dto.memeCategoryId) : '',
  categoryName:
    dto.memeCategoryId != null
      ? (categoryNameById.get(String(dto.memeCategoryId)) ?? '—')
      : '—',
  name: dto.name,
  videoThumbUrl: dto.path ?? '',
  duration: formatDurationMmSs(dto.durationSec ?? 0),
  status: dto.isActive ? 'active' : 'inactive',
})

export async function fetchAdminMemes(
  categoryNameById: Map<string, string>,
): Promise<AdminMemeRow[]> {
  const response = await $api.get<ApiEnvelope<MemeEntityDto[]>>(
    API_ENDPOINTS.content.memes,
  )

  if (!response.data.success) {
    throw new Error(response.data.message || 'Не удалось загрузить мемы')
  }

  const sorted = [...response.data.data].sort(
    (a, b) => Number(b.id) - Number(a.id),
  )

  return sorted.map((dto, index) => mapRow(dto, index, categoryNameById))
}

/** Минимальная длительность по ограничению БД (duration_sec > 0) */
export const MEME_MIN_DURATION_SEC = 1

const defaultMemePath = (name: string) =>
  `meme:${name.trim().replaceAll(/\s+/g, '_').slice(0, 200) || 'untitled'}`

export async function saveAdminMeme(input: {
  mode: 'create' | 'edit'
  categoryId: string
  categoryName: string
  name: string
  duration: string
  status: AdminMemeStatus
  row: AdminMemeRow | null
  nextNumber: number
}): Promise<AdminMemeRow> {
  const durationSec = Math.max(
    MEME_MIN_DURATION_SEC,
    parseDurationToSeconds(input.duration),
  )

  const existingPath =
    input.mode === 'edit' && input.row?.videoThumbUrl.trim()
      ? input.row.videoThumbUrl.trim()
      : ''

  const payload: {
    id?: number
    memeCategoryId: number | null
    name: string
    path: string
    durationSec: number
    isActive: boolean
  } = {
    memeCategoryId: input.categoryId ? Number(input.categoryId) : null,
    name: input.name.trim(),
    path:
      input.mode === 'edit'
        ? existingPath || defaultMemePath(input.name)
        : defaultMemePath(input.name),
    durationSec,
    isActive: input.status === 'active',
  }

  if (input.mode === 'edit' && input.row) {
    payload.id = Number(input.row.id)
  }

  const response = await $api.post<ApiEnvelope<MemeEntityDto>>(
    API_ENDPOINTS.content.memes,
    payload,
  )

  if (!response.data.success) {
    throw new Error(response.data.message || 'Не удалось сохранить мем')
  }

  const catMap = new Map([[input.categoryId, input.categoryName]])
  const mapped = mapRow(response.data.data, 0, catMap)
  if (input.mode === 'edit' && input.row) {
    return { ...mapped, number: input.row.number }
  }
  return { ...mapped, number: input.nextNumber }
}

const MEME_PLACEHOLDER_IMG =
  'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'

export function memeThumbSrc(row: AdminMemeRow): string {
  const t = row.videoThumbUrl.trim()
  if (!t || t.startsWith('meme:')) {
    return MEME_PLACEHOLDER_IMG
  }
  return t
}

export function filterMemes(
  const q = query.trim().toLowerCase()
  if (!q) {
    return rows
  }
  return rows.filter(
    (row) =>
      row.name.toLowerCase().includes(q) ||
      row.categoryName.toLowerCase().includes(q) ||
      row.duration.toLowerCase().includes(q),
  )
}

export function nextMemeNumber(rows: AdminMemeRow[]): number {
  let max = 0
  for (const row of rows) {
    if (row.number > max) {
      max = row.number
    }
  }
  return max + 1
}
