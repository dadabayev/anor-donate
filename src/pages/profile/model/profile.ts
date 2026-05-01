export interface ProfileFormValues {
  firstName: string
  lastName: string
  pnfl: string
  phone: string
  email: string
  password: string
  username: string
  channelName: string
  channelLink: string
  channelAbout: string
}

export interface ProfileSocialLink {
  id: string
  name: 'YouTube' | 'Twitch' | 'TikTok' | 'Telegram' | 'Discord'
  state: 'connected' | 'available'
  url: string | null
}

export type ProfileData = ProfileFormValues & {
  avatarUrl: string | null
  socialLinks: ProfileSocialLink[]
  /** API `profile.displayName`; used for readonly name display when set. */
  profileDisplayName?: string | null
}

export const PROFILE_STORAGE_KEY = 'anor-donate.profile'
export const PROFILE_MODE_KEY = 'anor-donate.profile.mode'

const DEFAULT_PASSWORD = '*'.repeat(17)

export const DEFAULT_PROFILE: ProfileData = {
  avatarUrl: null,
  profileDisplayName: null,
  firstName: 'Andy',
  lastName: 'Smith',
  pnfl: '00000000000000',
  phone: '+998 (12) 123-12-12',
  email: 'example@example.com',
  password: DEFAULT_PASSWORD,
  username: 'Andy',
  channelName: 'Andy',
  channelLink: '123',
  channelAbout: 'Short description of the channel.',
  socialLinks: [
    {
      id: 'youtube',
      name: 'YouTube',
      state: 'connected',
      url: 'https://youtube.com/@andysmith',
    },
    { id: 'tiktok', name: 'TikTok', state: 'available', url: null },
    { id: 'twitch', name: 'Twitch', state: 'available', url: null },
    { id: 'telegram', name: 'Telegram', state: 'available', url: null },
    { id: 'discord', name: 'Discord', state: 'available', url: null },
  ],
}

export const EMPTY_PROFILE: ProfileData = {
  ...DEFAULT_PROFILE,
  avatarUrl: null,
  socialLinks: [],
  firstName: '',
  lastName: '',
  pnfl: '',
  phone: '',
  email: '',
  password: '',
  username: '',
  channelName: '',
  channelLink: '',
  channelAbout: '',
}

export const readProfile = (): ProfileData | null => {
  if (typeof window === 'undefined') {
    return DEFAULT_PROFILE
  }

  const mode = window.localStorage.getItem(PROFILE_MODE_KEY)

  if (mode === 'error') {
    throw new Error('Unable to load profile')
  }

  if (mode === 'empty') {
    return null
  }

  const raw = window.localStorage.getItem(PROFILE_STORAGE_KEY)

  if (!raw) {
    return DEFAULT_PROFILE
  }

  try {
    const parsed = JSON.parse(raw) as Partial<ProfileData>

    return {
      ...DEFAULT_PROFILE,
      ...parsed,
      profileDisplayName:
        typeof parsed.profileDisplayName === 'string' ||
        parsed.profileDisplayName === null
          ? parsed.profileDisplayName
          : DEFAULT_PROFILE.profileDisplayName,
      socialLinks: Array.isArray(parsed.socialLinks)
        ? DEFAULT_PROFILE.socialLinks.map((defaultSocial) => {
            const parsedSocial = parsed.socialLinks?.find(
              (item) => item?.id === defaultSocial.id,
            )

            return {
              ...defaultSocial,
              ...parsedSocial,
              url:
                typeof parsedSocial?.url === 'string' ? parsedSocial.url : null,
            }
          })
        : DEFAULT_PROFILE.socialLinks,
    }
  } catch {
    return DEFAULT_PROFILE
  }
}

export const writeProfile = (profile: ProfileData) => {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile))
  window.localStorage.removeItem(PROFILE_MODE_KEY)
}
