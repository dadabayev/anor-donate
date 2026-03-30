import cn from './profile-header-section.module.css'

import type { ChangeEvent, RefObject } from 'react'

interface ProfileHeaderSectionProps {
  title: string
  pickFileLabel: string
  avatarUrl: string | null
  firstLetter: string
  fullName: string
  avatarFileName: string | null
  avatarInputRef: RefObject<HTMLInputElement | null>
  isBusy: boolean
  onPickAvatar: (event: ChangeEvent<HTMLInputElement>) => void
}

export const ProfileHeaderSection = ({
  title,
  pickFileLabel,
  avatarUrl,
  firstLetter,
  fullName,
  avatarFileName,
  avatarInputRef,
  isBusy,
  onPickAvatar,
}: Readonly<ProfileHeaderSectionProps>) => {
  return (
    <section className={cn.cardSection} aria-labelledby="profile-add-word">
      <h2 id="profile-add-word" className={cn.sectionTitle}>
        {title}
      </h2>

      <div className={cn.profileHeader}>
        <div className={cn.avatar} aria-hidden="true">
          {avatarUrl ? (
            <img src={avatarUrl} alt="" className={cn.avatarImage} />
          ) : (
            <span className={cn.avatarInitials}>{firstLetter}</span>
          )}
        </div>

        <div className={cn.profileMeta}>
          <p className={cn.profileName}>{fullName}</p>

          <div className={cn.buttonRow}>
            <button
              type="button"
              className={cn.fileButton}
              disabled={isBusy}
              onClick={() => avatarInputRef.current?.click()}
            >
              {pickFileLabel}
            </button>
            <input
              ref={avatarInputRef}
              type="file"
              accept="image/*"
              className={cn.srOnly}
              onChange={onPickAvatar}
              aria-label={pickFileLabel}
            />
            {avatarFileName ? (
              <span className={cn.profileFileName}>{avatarFileName}</span>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  )
}
