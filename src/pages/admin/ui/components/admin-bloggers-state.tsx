import cn from '../admin-bloggers-page.module.css'

import { IconRefresh } from '@tabler/icons-react'
import type { ReactNode } from 'react'
import { ReactSVG } from 'react-svg'

interface AdminBloggersStateProps {
  title: string
  stateTitle: string
  text: string
  actionLabel: string
  onAction: () => void
  image?: string
  icon?: ReactNode
  /** Only the inner card — use when the page already has a title and toolbar. */
  embedded?: boolean
}

export const AdminBloggersState = ({
  title,
  stateTitle,
  text,
  actionLabel,
  onAction,
  image,
  icon,
  embedded = false,
}: Readonly<AdminBloggersStateProps>) => {
  const card = (
    <div className={cn.stateCard}>
      {icon ? <div className={cn.stateIcon}>{icon}</div> : null}
      {image ? (
        <div className={cn.stateArtwork} aria-hidden="true">
          <ReactSVG src={image} />
        </div>
      ) : null}
      <h2 className={cn.stateTitle}>{stateTitle}</h2>
      <p className={cn.stateText}>{text}</p>
      <button type="button" className={cn.stateAction} onClick={onAction}>
        <IconRefresh size={18} stroke={2} />
        <span>{actionLabel}</span>
      </button>
    </div>
  )

  if (embedded) {
    return card
  }

  return (
    <section className={cn.page}>
      <header className={cn.headerBlock}>
        <h1 className={cn.title}>{title}</h1>
      </header>
      {card}
    </section>
  )
}
