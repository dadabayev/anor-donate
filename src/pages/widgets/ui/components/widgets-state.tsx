import cn from '../widgets-page.module.css'

import { IconRefresh } from '@tabler/icons-react'

interface WidgetsStateProps {
  title: string
  stateTitle: string
  text: string
  actionLabel: string
  image: string
  onAction: () => void
}

export const WidgetsState = ({
  title,
  stateTitle,
  text,
  actionLabel,
  image,
  onAction,
}: Readonly<WidgetsStateProps>) => {
  return (
    <section className={cn.page}>
      <div className={cn.column}>
        <header className={cn.hero}>
          <div className={cn.heroText}>
            <h1 className={cn.title}>{title}</h1>
          </div>
        </header>

        <section className={cn.stateCard}>
          <img
            src={image}
            alt=""
            aria-hidden="true"
            className={cn.stateImage}
          />
          <h2 className={cn.stateTitle}>{stateTitle}</h2>
          <p className={cn.stateText}>{text}</p>
          <button type="button" className={cn.primaryButton} onClick={onAction}>
            <IconRefresh size={18} stroke={2} />
            <span>{actionLabel}</span>
          </button>
        </section>
      </div>
    </section>
  )
}
