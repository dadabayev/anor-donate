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

export const ADMIN_MEMES_FAIL_ONCE_KEY = 'admin-memes-fail-once'

const delay = (ms: number) =>
  new Promise<void>((resolve) => {
    window.setTimeout(resolve, ms)
  })

const CATEGORY_POOL = [
  { id: 'meme-cat-1', name: 'Reaksiyalar' },
  { id: 'meme-cat-2', name: 'Sport' },
  { id: 'meme-cat-3', name: 'Muzika' },
] as const

const buildRow = (index: number): AdminMemeRow => {
  const n = index + 1
  const cat = CATEGORY_POOL[index % CATEGORY_POOL.length]
  return {
    id: `meme-${n}`,
    number: n,
    categoryId: cat.id,
    categoryName: cat.name,
    name: `Mem nomi ${n}`,
    videoThumbUrl: `https://picsum.photos/seed/anor-meme-${n}/160/90`,
    duration: `${(index % 7) + 1}:${String((index * 13) % 59).padStart(2, '0')}`,
    status: index % 7 === 0 ? 'inactive' : 'active',
  }
}

export const MOCK_ADMIN_MEMES: AdminMemeRow[] = Array.from(
  { length: 280 },
  (_, i) => buildRow(i),
)

export async function fetchAdminMemes(): Promise<AdminMemeRow[]> {
  await delay(420)
  if (
    typeof window !== 'undefined' &&
    window.sessionStorage.getItem(ADMIN_MEMES_FAIL_ONCE_KEY) === '1'
  ) {
    window.sessionStorage.removeItem(ADMIN_MEMES_FAIL_ONCE_KEY)
    throw new Error('admin-memes-fetch-failed')
  }
  return MOCK_ADMIN_MEMES
}

export function filterMemes(
  rows: AdminMemeRow[],
  query: string,
): AdminMemeRow[] {
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
