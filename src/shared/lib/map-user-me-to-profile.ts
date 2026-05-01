import { formatUzbekistanPhoneInput } from './format-uzbekistan-phone'
import type { UserMeDataDto } from '@shared/api'

const DEFAULT_PASSWORD = '*'.repeat(17)

/** Defaults merged with GET /user/me (matches app profile defaults; keep in sync with pages/profile). */
const USER_ME_PROFILE_DEFAULTS = {
  avatarUrl: null as string | null,
  profileDisplayName: null as string | null,
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
      name: 'YouTube' as const,
      state: 'connected' as const,
      url: 'https://youtube.com/@andysmith',
    },
    {
      id: 'tiktok',
      name: 'TikTok' as const,
      state: 'available' as const,
      url: null,
    },
    {
      id: 'twitch',
      name: 'Twitch' as const,
      state: 'available' as const,
      url: null,
    },
    {
      id: 'telegram',
      name: 'Telegram' as const,
      state: 'available' as const,
      url: null,
    },
    {
      id: 'discord',
      name: 'Discord' as const,
      state: 'available' as const,
      url: null,
    },
  ],
}

const apiBase = () =>
  (import.meta.env.VITE_APP_API_URL as string | undefined)?.replace(
    /\/$/,
    '',
  ) ?? ''

const resolveMediaUrl = (path: string | null): string | null => {
  if (!path?.trim()) {
    return null
  }

  const trimmed = path.trim()
  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed
  }

  const base = apiBase()
  if (!base) {
    return trimmed.startsWith('/') ? trimmed : `/${trimmed}`
  }

  return trimmed.startsWith('/') ? `${base}${trimmed}` : `${base}/${trimmed}`
}

const phoneFromMe = (profile: UserMeDataDto['profile']): string => {
  const raw = profile.phoneE164 ?? profile.pendingPhoneE164
  if (!raw?.trim()) {
    return ''
  }

  return formatUzbekistanPhoneInput(raw.trim())
}

export const mapUserMeToProfileData = (me: UserMeDataDto) => {
  const { account, profile } = me

  return {
    ...USER_ME_PROFILE_DEFAULTS,
    username: account.username,
    firstName: profile.firstName ?? '',
    lastName: profile.lastName ?? '',
    email: profile.email ?? '',
    phone: phoneFromMe(profile),
    channelName: profile.channelName ?? '',
    channelLink: profile.channelUrl ?? '',
    channelAbout: profile.channelDescription ?? '',
    profileDisplayName: profile.displayName?.trim() || null,
    avatarUrl:
      resolveMediaUrl(profile.photoPath) ??
      resolveMediaUrl(profile.verifiedPhotoPath),
  }
}
