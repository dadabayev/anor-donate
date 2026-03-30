import cn from './profile-state.module.css'

import { IconRefresh } from '@tabler/icons-react'
import type { ReactNode } from 'react'

interface ProfileStateProps {
  title: string
  stateTitle: string
  text: string
  actionLabel: string
  onAction: () => void
  image: string | null
  icon?: ReactNode
}

export const ProfileState = ({
  title,
  stateTitle,
  text,
  actionLabel,
  onAction,
  image,
  icon,
}: Readonly<ProfileStateProps>) => {
  return (
    <section className={cn.page}>
      <div className={cn.column}>
        <header className={cn.header}>
          <h1 className={cn.title}>{title}</h1>
        </header>
        <div className={cn.card}>
          <div className={cn.stateCard}>
            {icon ? icon : null}
            {image ? (
              <img
                src={image}
                alt=""
                aria-hidden="true"
                className={cn.stateArtwork}
              />
            ) : null}
            <h2 className={cn.stateTitle}>{stateTitle}</h2>
            <p className={cn.stateText}>{text}</p>
            <button type="button" className={cn.retryButton} onClick={onAction}>
              {image ? (
                actionLabel
              ) : (
                <span
                  style={{
                    display: 'inline-flex',
                    gap: 8,
                    alignItems: 'center',
                  }}
                >
                  <IconRefresh size={18} stroke={2} />
                  {actionLabel}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
