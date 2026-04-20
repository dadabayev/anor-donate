export interface AdminTtsWordRow {
  id: string
  number: number
  fromWord: string
  toWord: string
  isStandardFilter: boolean
  /** Displayed as in Figma, e.g. "2025-11-30 11:30" */
  createdAt: string
}

export const ADMIN_TTS_PAGE_SIZE = 10

export const ADMIN_TTS_FAIL_ONCE_KEY = 'admin-tts-fail-once'

const delay = (ms: number) =>
  new Promise<void>((resolve) => {
    window.setTimeout(resolve, ms)
  })

const formatCreatedAt = (index: number): string => {
  const day = 1 + (index % 28)
  const hour = 8 + (index % 12)
  const minute = (index * 7) % 60
  return `2025-11-${String(day).padStart(2, '0')} ${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`
}

const buildRow = (index: number): AdminTtsWordRow => {
  const n = index + 1
  return {
    id: `tts-${n}`,
    number: n,
    fromWord: `lorem_${n}`,
    toWord: `ipsum_${n}`,
    isStandardFilter: index % 3 !== 0,
    createdAt: formatCreatedAt(index),
  }
}

export const MOCK_ADMIN_TTS_WORDS: AdminTtsWordRow[] = Array.from(
  { length: 330 },
  (_, i) => buildRow(i),
)

export async function fetchAdminTtsWords(): Promise<AdminTtsWordRow[]> {
  await delay(420)
  if (
    typeof window !== 'undefined' &&
    window.sessionStorage.getItem(ADMIN_TTS_FAIL_ONCE_KEY) === '1'
  ) {
    window.sessionStorage.removeItem(ADMIN_TTS_FAIL_ONCE_KEY)
    throw new Error('admin-tts-fetch-failed')
  }
  return MOCK_ADMIN_TTS_WORDS
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
