import cn from '../memes-page.module.css'

import { IconRefresh } from '@tabler/icons-react'

interface MemesStateProps {
  actionLabel: string
  image: string
  stateTitle: string
  text: string
  title: string
  onAction: () => void
}

export const MemesState = ({
  actionLabel,
  image,
  stateTitle,
  text,
  title,
  onAction,
}: Readonly<MemesStateProps>) => (
  <section className={cn.page}>
    <div className={cn.column}>
      <header className={cn.hero}>
        <h1 className={cn.title}>{title}</h1>
      </header>

      <section className={cn.stateCard}>
        <img src={image} alt="" aria-hidden="true" className={cn.stateImage} />
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
