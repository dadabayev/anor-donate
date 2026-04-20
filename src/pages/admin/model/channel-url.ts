/** Compact channel string for table display, derived from a URL or host/path input. */
export function channelSlugFromUrl(channelUrl: string): string {
  const trimmed = channelUrl.trim()
  if (!trimmed) {
    return ''
  }
  try {
    const withProto = trimmed.includes('://') ? trimmed : `https://${trimmed}`
    const u = new URL(withProto)
    const path = u.pathname === '/' ? '' : u.pathname
    return `${u.hostname}${path}`.replace(/\/$/, '')
  } catch {
    return trimmed.replace(/^https?:\/\//i, '')
  }
}
