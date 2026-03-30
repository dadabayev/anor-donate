import cn from './profile-social-section.module.css'

import type { ProfileSocialLink } from '../../../model/profile'
import { ProfileSocialLinkRow } from '../profile-social-link-row'
import classNames from 'classnames'

interface ProfileSocialSectionProps {
  title: string
  socialLinks: ProfileSocialLink[]
  onRemoveSocial: (id: string) => void
  onOpenSocial: (social: ProfileSocialLink) => void
  onRestoreDefaults: () => void
  labels: {
    emptySocials: string
    emptySocialsText: string
    restoreSocials: string
  }
}

export const ProfileSocialSection = ({
  title,
  socialLinks,
  onRemoveSocial,
  onOpenSocial,
  onRestoreDefaults,
  labels,
}: Readonly<ProfileSocialSectionProps>) => {
  return (
    <section className={cn.cardSection} aria-labelledby="profile-socials">
      <h2 id="profile-socials" className={cn.sectionTitle}>
        {title}
      </h2>

      <div className={cn.socialGrid}>
        {socialLinks.length > 0 ? (
          socialLinks.map((social) => (
            <ProfileSocialLinkRow
              key={social.id}
              social={social}
              onRemove={onRemoveSocial}
              onOpen={onOpenSocial}
            />
          ))
        ) : (
          <div className={classNames(cn.stateCard, cn.socialButtonFullWidth)}>
            <h3 className={cn.stateTitle}>{labels.emptySocials}</h3>
            <p className={cn.stateText}>{labels.emptySocialsText}</p>
            <button
              type="button"
              className={cn.retryButton}
              onClick={onRestoreDefaults}
            >
              {labels.restoreSocials}
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
