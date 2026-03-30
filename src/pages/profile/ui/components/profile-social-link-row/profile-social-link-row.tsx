import cn from './profile-social-link-row.module.css'

import type { ProfileSocialLink } from '../../../model/profile'
import {
  IconBrandDiscordFilled,
  IconBrandTelegram,
  IconBrandTiktok,
  IconBrandTwitch,
  IconBrandYoutubeFilled,
  IconChevronRight,
  IconTrash,
} from '@tabler/icons-react'
import classNames from 'classnames'

const socialIconMap = {
  YouTube: IconBrandYoutubeFilled,
  Twitch: IconBrandTwitch,
  TikTok: IconBrandTiktok,
  Telegram: IconBrandTelegram,
  Discord: IconBrandDiscordFilled,
} as const

interface ProfileSocialLinkRowProps {
  social: ProfileSocialLink
  onRemove: (id: string) => void
  onOpen: (social: ProfileSocialLink) => void
}

export const ProfileSocialLinkRow = ({
  social,
  onRemove,
  onOpen,
}: Readonly<ProfileSocialLinkRowProps>) => {
  const Icon = socialIconMap[social.name]
  const connected = social.state === 'connected'

  if (connected) {
    return (
      <div className={classNames(cn.socialRow, cn.socialRowConnected)}>
        <button
          type="button"
          className={cn.socialConnectedButton}
          onClick={() => onOpen(social)}
        >
          <span className={cn.socialIconWrap}>
            <Icon size={18} stroke={2} />
          </span>
          <span className={cn.socialLabel}>{social.name}</span>
        </button>

        <button
          type="button"
          className={classNames(cn.rowActionButton, cn.rowActionButtonDanger)}
          aria-label={`Delete ${social.name}`}
          onClick={() => onRemove(social.id)}
        >
          <IconTrash size={18} stroke={2} />
        </button>
      </div>
    )
  }

  return (
    <button
      type="button"
      className={cn.socialButton}
      onClick={() => onOpen(social)}
    >
      <span className={cn.socialIconWrap}>
        <Icon
          size={18}
          stroke={2}
          className={
            social.name === 'YouTube'
              ? cn.iconYoutube
              : social.name === 'Twitch'
                ? cn.iconTwitch
                : social.name === 'TikTok'
                  ? cn.iconTiktok
                  : social.name === 'Telegram'
                    ? cn.iconTelegram
                    : cn.iconDiscord
          }
        />
      </span>
      <span className={cn.socialLabel}>{social.name}</span>
      <IconChevronRight size={20} stroke={2} className={cn.rowChevron} />
    </button>
  )
}
