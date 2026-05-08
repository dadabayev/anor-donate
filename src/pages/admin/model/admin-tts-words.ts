import { $api } from '@shared/api'
import type { ApiEnvelope } from '@shared/api/api-envelope'
import { API_ENDPOINTS } from '@shared/constants'
import { formatAdminDateTime } from '@shared/lib/admin-format'

export interface AdminTtsWordRow {
  id: string
  number: number
  fromWord: string
  toWord: string
  isStandardFilter: boolean
  createdAt: string
}

export const ADMIN_TTS_PAGE_SIZE = 10

interface GlobalWordEntityDto {
  id: number
  wordFrom: string
  wordTo: string | null
  isStandard: boolean
  createdAt: string
}

const mapRow = (dto: GlobalWordEntityDto, index: number): AdminTtsWordRow => ({
  id: String(dto.id),
  number: index + 1,
  fromWord: dto.wordFrom,
  toWord: dto.wordTo?.trim() ?? '',
  isStandardFilter: Boolean(dto.isStandard),
  createdAt: formatAdminDateTime(dto.createdAt),
})

export async function fetchAdminTtsWords(): Promise<AdminTtsWordRow[]> {
  const response = await $api.get<ApiEnvelope<GlobalWordEntityDto[]>>(
    API_ENDPOINTS.moderation.globalWords,
  )

  if (!response.data.success) {
    throw new Error(response.data.message || 'Не удалось загрузить слова')
  }

  const sorted = [...response.data.data].sort(
    (a, b) => Number(b.id) - Number(a.id),
  )

  return sorted.map((dto, index) => mapRow(dto, index))
}

export async function createAdminGlobalWord(input: {
  fromWord: string
  toWord: string
  isStandardFilter: boolean
  nextRowNumber: number
}): Promise<AdminTtsWordRow> {
  const response = await $api.post<ApiEnvelope<GlobalWordEntityDto>>(
    API_ENDPOINTS.moderation.globalWords,
    {
      wordFrom: input.fromWord.trim(),
      wordTo: input.toWord.trim() || null,
      isStandard: input.isStandardFilter,
    },
  )

  if (!response.data.success) {
    throw new Error(response.data.message || 'Не удалось создать запись')
  }

  const mapped = mapRow(response.data.data, 0)
  return { ...mapped, number: input.nextRowNumber }
}

export function filterTtsWords(
  rows: AdminTtsWordRow[],
  query: string,
): AdminTtsWordRow[] {
  const q = query.trim().toLowerCase()
  if (!q) {
    return rows
  }
  return rows.filter((row) => {
    return (
      row.fromWord.toLowerCase().includes(q) ||
      row.toWord.toLowerCase().includes(q) ||
      row.createdAt.toLowerCase().includes(q)
    )
  })
}

export function nextTtsWordNumber(rows: AdminTtsWordRow[]): number {
  let max = 0
  for (const row of rows) {
    if (row.number > max) {
      max = row.number
    }
  }
  return max + 1
}
