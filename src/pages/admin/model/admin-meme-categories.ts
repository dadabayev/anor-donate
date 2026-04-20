export interface AdminMemeCategoryRow {
  id: string
  number: number
  name: string
  createdAt: string
}

export const ADMIN_MEME_CATEGORY_PAGE_SIZE = 10

export const ADMIN_MEME_CATEGORIES_FAIL_ONCE_KEY =
  'admin-meme-categories-fail-once'

const delay = (ms: number) =>
  new Promise<void>((resolve) => {
    window.setTimeout(resolve, ms)
  })

const formatCreatedAt = (index: number): string => {
  const day = 1 + (index % 28)
  const hour = 9 + (index % 10)
  const minute = (index * 11) % 60
  return `2025-11-${String(day).padStart(2, '0')} ${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`
}

const buildRow = (index: number): AdminMemeCategoryRow => {
  const n = index + 1
  return {
    id: `meme-cat-${n}`,
    number: n,
    name: `lorem_${n}`,
    createdAt: formatCreatedAt(index),
  }
}

export const MOCK_ADMIN_MEME_CATEGORIES: AdminMemeCategoryRow[] = Array.from(
  { length: 220 },
  (_, i) => buildRow(i),
)

export async function fetchAdminMemeCategories(): Promise<
  AdminMemeCategoryRow[]
> {
  await delay(400)
  if (
    typeof window !== 'undefined' &&
    window.sessionStorage.getItem(ADMIN_MEME_CATEGORIES_FAIL_ONCE_KEY) === '1'
  ) {
    window.sessionStorage.removeItem(ADMIN_MEME_CATEGORIES_FAIL_ONCE_KEY)
    throw new Error('admin-meme-categories-fetch-failed')
  }
  return MOCK_ADMIN_MEME_CATEGORIES
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
