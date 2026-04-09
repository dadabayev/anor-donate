import cn from '../fundraising-page.module.css'

import { IconRefresh } from '@tabler/icons-react'

interface FundraisingStateProps {
  title: string
  stateTitle: string
  text: string
  actionLabel: string
  image: string
  onAction: () => void
}

export const FundraisingState = ({
  title,
  stateTitle,
  text,
  actionLabel,
  image,
  onAction,
}: Readonly<FundraisingStateProps>) => {
  return (
    <section className={cn.page}>
      <div className={cn.column}>
        <header className={cn.hero}>
          <h1 className={cn.title}>{title}</h1>
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
          <button type="button" className={cn.stateAction} onClick={onAction}>
            <IconRefresh size={18} stroke={2} />
            <span>{actionLabel}</span>
          </button>
        </section>
      </div>
    </section>
  )
}
