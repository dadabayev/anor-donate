import type { AdminBloggerRow } from './admin-bloggers'

export interface AdminModerationRow extends AdminBloggerRow {
  channelThumbUrl: string | null
}

export const ADMIN_MODERATION_PAGE_SIZE = 10

export const ADMIN_MODERATION_FAIL_ONCE_KEY = 'admin-moderation-fail-once'

const delay = (ms: number) =>
  new Promise<void>((resolve) => {
    window.setTimeout(resolve, ms)
  })

const buildRow = (index: number): AdminModerationRow => {
  const n = index + 1
  return {
    id: `moderation-${n}`,
    number: n,
    nickname: `pending_${n}`,
    fullName: `Nomzod ${n}`,
    channel: `youtube.com/c/pending${n}`,
    phone: '+998 (90) 555-12-34',
    status: 'active',
    username: `pending_${n}`,
    channelName: `Kanal ${n}`,
    channelUrl: `https://youtube.com/c/pending${n}`,
    email: `pending${n}@example.com`,
    channelAbout: `Kanal tavsifi ${n}.`,
    passwordDisplay: '*'.repeat(8),
    channelThumbUrl: `https://picsum.photos/seed/anor-mod-${n}/96/96`,
  }
}

export const MOCK_ADMIN_MODERATION: AdminModerationRow[] = Array.from(
  { length: 42 },
  (_, i) => buildRow(i),
)

export async function fetchAdminModeration(): Promise<AdminModerationRow[]> {
  await delay(420)
  if (
    typeof window !== 'undefined' &&
    window.sessionStorage.getItem(ADMIN_MODERATION_FAIL_ONCE_KEY) === '1'
  ) {
    window.sessionStorage.removeItem(ADMIN_MODERATION_FAIL_ONCE_KEY)
    throw new Error('admin-moderation-fetch-failed')
  }
  return MOCK_ADMIN_MODERATION
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
