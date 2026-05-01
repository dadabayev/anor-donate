import cn from './profile-figma-view.module.css'

import type { ProfileData } from '../model/profile'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

interface ProfileFigmaViewProps {
  profile: ProfileData
}

export const ProfileFigmaView = ({
  profile,
}: Readonly<ProfileFigmaViewProps>) => {
  const { t } = useTranslation()
  const displayName =
    profile.profileDisplayName?.trim() ||
    `${profile.firstName} ${profile.lastName}`.trim() ||
    profile.username
  const firstLetter =
    profile.profileDisplayName?.trim().charAt(0) ||
    profile.firstName.trim().charAt(0) ||
    profile.username.trim().charAt(0) ||
    'A'

  return (
    <section className={cn.page}>
      <div className={cn.column}>
        <header className={cn.header}>
          <h1 className={cn.title}>{t('profile.pageTitle')}</h1>
        </header>

        <div className={cn.card}>
          <div className={cn.hero}>
            <div className={cn.avatarBlock}>
              <div className={cn.avatar}>
                {profile.avatarUrl ? (
                  <img
                    className={cn.avatarImage}
                    src={profile.avatarUrl}
                    alt=""
                  />
                ) : (
                  <span className={cn.avatarInitials}>{firstLetter}</span>
                )}
              </div>
            </div>

            <div className={cn.fields}>
              <div className={cn.grid}>
                <div className={cn.field}>
                  <span className={cn.label}>{t('profile.username')}</span>
                  <div className={cn.inputShell}>
                    <input
                      className={cn.input}
                      readOnly
                      value={profile.username}
                      aria-readonly="true"
                    />
                  </div>
                </div>
                <div className={cn.field}>
                  <span className={cn.label}>
                    {t('profile.figmaNameLabel')}
                  </span>
                  <div className={cn.inputShell}>
                    <input
                      className={cn.input}
                      readOnly
                      value={displayName}
                      aria-readonly="true"
                    />
                  </div>
                </div>
                <div className={cn.field}>
                  <span className={cn.label}>{t('profile.phone')}</span>
                  <div className={cn.inputShell}>
                    <input
                      className={cn.input}
                      readOnly
                      value={profile.phone}
                      aria-readonly="true"
                    />
                  </div>
                </div>
                <div className={cn.field}>
                  <span className={cn.label}>{t('profile.channelName')}</span>
                  <div className={cn.inputShell}>
                    <input
                      className={cn.input}
                      readOnly
                      value={profile.channelName}
                      aria-readonly="true"
                    />
                  </div>
                </div>
                <div className={cn.field}>
                  <span className={cn.label}>{t('profile.channelLink')}</span>
                  <div className={cn.inputShell}>
                    <input
                      className={cn.input}
                      readOnly
                      value={profile.channelLink}
                      aria-readonly="true"
                    />
                  </div>
                </div>
                <div className={cn.field}>
                  <span className={cn.label}>{t('profile.email')}</span>
                  <div className={cn.inputShell}>
                    <input
                      className={cn.input}
                      readOnly
                      value={profile.email}
                      aria-readonly="true"
                    />
                  </div>
                </div>
                <div className={`${cn.field} ${cn.fieldFull}`}>
                  <span className={cn.label}>{t('profile.channelAbout')}</span>
                  <div className={cn.inputShell}>
                    <input
                      className={cn.input}
                      readOnly
                      value={profile.channelAbout}
                      aria-readonly="true"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <footer className={cn.footer}>
            <Link className={cn.backLink} to="/dashboard">
              {t('profile.backToDashboard')}
            </Link>
            <Link className={cn.primaryLink} to="/profile/edit">
              {t('profile.editProfile')}
            </Link>
          </footer>
        </div>
      </div>
    </section>
  )
}
