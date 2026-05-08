import { $api } from '@shared/api'
import type { ApiEnvelope } from '@shared/api/api-envelope'
import { API_ENDPOINTS } from '@shared/constants'
import { formatAdminDateTime } from '@shared/lib/admin-format'

export interface AdminMemeCategoryRow {
  id: string
  number: number
  name: string
  createdAt: string
}

export const ADMIN_MEME_CATEGORY_PAGE_SIZE = 10

interface MemeCategoryEntityDto {
  id: number
  name: string
  createdAt: string
}

const mapRow = (dto: MemeCategoryEntityDto, index: number): AdminMemeCategoryRow => ({
  id: String(dto.id),
  number: index + 1,
  name: dto.name,
  createdAt: formatAdminDateTime(dto.createdAt),
})

export async function fetchAdminMemeCategories(): Promise<AdminMemeCategoryRow[]> {
  const response = await $api.get<ApiEnvelope<MemeCategoryEntityDto[]>>(
    API_ENDPOINTS.content.memeCategories,
  )

  if (!response.data.success) {
    throw new Error(response.data.message || 'Не удалось загрузить категории')
  }

  const sorted = [...response.data.data].sort(
    (a, b) => Number(b.id) - Number(a.id),
  )

  return sorted.map((dto, index) => mapRow(dto, index))
}

export async function saveAdminMemeCategory(input: {
  mode: 'create' | 'edit'
  name: string
  rowId: string | null
  rowNumber?: number
  nextNumber?: number
}): Promise<AdminMemeCategoryRow> {
  const payload: { id?: number; name: string } = {
    name: input.name.trim(),
  }
  if (input.mode === 'edit' && input.rowId) {
    payload.id = Number(input.rowId)
  }

  const response = await $api.post<ApiEnvelope<MemeCategoryEntityDto>>(
    API_ENDPOINTS.content.memeCategories,
    payload,
  )

  if (!response.data.success) {
    throw new Error(response.data.message || 'Не удалось сохранить категорию')
  }

  const base = mapRow(response.data.data, 0)
  const number =
    input.mode === 'edit' && input.rowNumber != null
      ? input.rowNumber
      : (input.nextNumber ?? base.number)
  return { ...base, number }
}

export function filterMemeCategories(
  rows: AdminMemeCategoryRow[],
  query: string,
): AdminMemeCategoryRow[] {
  const q = query.trim().toLowerCase()
  if (!q) {
    return rows
  }
  return rows.filter(
    (row) =>
      row.name.toLowerCase().includes(q) ||
      row.createdAt.toLowerCase().includes(q),
  )
}

export function nextMemeCategoryNumber(rows: AdminMemeCategoryRow[]): number {
  let max = 0
  for (const row of rows) {
    if (row.number > max) {
      max = row.number
    }
  }
  return max + 1
}
