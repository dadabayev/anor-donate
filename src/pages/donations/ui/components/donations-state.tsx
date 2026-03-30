import cn from '../donations-page.module.css'

import { IconRefresh } from '@tabler/icons-react'
import type { ReactNode } from 'react'
import { ReactSVG } from 'react-svg'

interface DonationsStateProps {
  title: string
  stateTitle: string
  text: string
  actionLabel: string
  onAction: () => void
  image?: string
  icon?: ReactNode
}

export const DonationsState = ({
  title,
  stateTitle,
  text,
  actionLabel,
  onAction,
  image,
  icon,
}: Readonly<DonationsStateProps>) => {
  return (
    <section className={cn.page}>
      <header className={cn.header}>
        <h1 className={cn.title}>{title}</h1>
      </header>

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
    </section>
  )
}
