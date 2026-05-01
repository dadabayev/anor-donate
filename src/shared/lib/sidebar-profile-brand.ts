export interface SidebarProfileBrandSource {
  profileDisplayName?: string | null
  firstName: string
  lastName: string
  username: string
}

export const getSidebarBrandFromProfile = (
  profile: SidebarProfileBrandSource | undefined,
  fallback: string,
): string => {
  if (!profile) {
    return fallback
  }

  const fromDisplay = profile.profileDisplayName?.trim()
  if (fromDisplay) {
    return fromDisplay
  }

  const fullName = `${profile.firstName} ${profile.lastName}`.trim()
  if (fullName) {
    return fullName
  }

  const username = profile.username?.trim()
  if (username) {
    return username
  }

  return fallback
}
