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

export const ADMIN_NEWS_FAIL_ONCE_KEY = 'admin-news-fail-once'

const delay = (ms: number) =>
  new Promise<void>((resolve) => {
    window.setTimeout(resolve, ms)
  })

const formatCreatedAt = (index: number): string => {
  const day = 1 + (index % 27)
  const hour = 8 + (index % 12)
  const minute = (index * 7) % 60
  return `2025-10-${String(day).padStart(2, '0')} ${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`
}

const buildRow = (index: number): AdminNewsRow => {
  const n = index + 1
  return {
    id: `news-${n}`,
    number: n,
    title: `Yangilik sarlavhasi ${n}`,
    body: `Qisqa matn va batafsil tavsif ${n}. Bu yerda yangilik matni joylashadi.`,
    coverImageUrl: `https://picsum.photos/seed/anor-news-${n}/320/180`,
    createdAt: formatCreatedAt(index),
    status: index % 5 === 0 ? 'draft' : 'published',
  }
}

export const MOCK_ADMIN_NEWS: AdminNewsRow[] = Array.from(
  { length: 210 },
  (_, i) => buildRow(i),
)

export async function fetchAdminNews(): Promise<AdminNewsRow[]> {
  await delay(380)
  if (
    typeof window !== 'undefined' &&
    window.sessionStorage.getItem(ADMIN_NEWS_FAIL_ONCE_KEY) === '1'
  ) {
    window.sessionStorage.removeItem(ADMIN_NEWS_FAIL_ONCE_KEY)
    throw new Error('admin-news-fetch-failed')
  }
  return MOCK_ADMIN_NEWS
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
