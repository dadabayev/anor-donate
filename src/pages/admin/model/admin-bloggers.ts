export type BloggerStatus = 'active' | 'blocked'

export interface AdminBloggerRow {
  id: string
  number: number
  nickname: string
  fullName: string
  channel: string
  phone: string
  status: BloggerStatus
  username: string
  channelName: string
  channelUrl: string
  email: string
  channelAbout: string
  /** Plain value for admin “view” modal (mock). */
  passwordDisplay: string
}

export const ADMIN_BLOGGERS_PAGE_SIZE = 10

/** Set to `1` in sessionStorage before load to force one failed fetch (QA). */
export const ADMIN_BLOGGERS_FAIL_ONCE_KEY = 'admin-bloggers-fail-once'

const delay = (ms: number) =>
  new Promise<void>((resolve) => {
    window.setTimeout(resolve, ms)
  })

const buildRow = (index: number): AdminBloggerRow => {
  const n = index + 1
  const blocked = index % 11 === 0

  return {
    id: `blogger-${n}`,
    number: n,
    nickname: `user_${n}`,
    fullName: `Ism Familiya ${n}`,
    channel: `youtube.com/c/channel${n}`,
    phone: '+998 (90) 123-45-67',
    status: blocked ? 'blocked' : 'active',
    username: `user_${n}`,
    channelName: `Kanal ${n}`,
    channelUrl: `https://youtube.com/c/channel${n}`,
    email: `user${n}@example.com`,
    channelAbout: `Kanal haqida qisqacha matn ${n}.`,
    /* eslint-disable-next-line sonarjs/no-hardcoded-passwords -- Figma mock; replace with API */
    passwordDisplay: 'admin',
  }
}

export const MOCK_ADMIN_BLOGGERS: AdminBloggerRow[] = Array.from(
  { length: 330 },
  (_, i) => buildRow(i),
)

export async function fetchAdminBloggers(): Promise<AdminBloggerRow[]> {
  await delay(420)
  if (
    typeof window !== 'undefined' &&
    window.sessionStorage.getItem(ADMIN_BLOGGERS_FAIL_ONCE_KEY) === '1'
  ) {
    window.sessionStorage.removeItem(ADMIN_BLOGGERS_FAIL_ONCE_KEY)
    throw new Error('admin-bloggers-fetch-failed')
  }
  return MOCK_ADMIN_BLOGGERS
}

export function filterBloggers(
  rows: AdminBloggerRow[],
  query: string,
): AdminBloggerRow[] {
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
