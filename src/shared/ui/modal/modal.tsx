import cn from './modal.module.css'

import { IconX } from '@tabler/icons-react'
import classNames from 'classnames'
import { type MouseEvent, type ReactNode, useEffect, useMemo } from 'react'
import { createPortal } from 'react-dom'

interface ModalProps {
  isOpen: boolean
  title?: ReactNode
  children: ReactNode
  footer?: ReactNode
  onClose: () => void
  closeAriaLabel?: string
  width?: 'sm' | 'md' | 'lg'
  /** When false, backdrop click and Escape do not close (header X still calls onClose unless disabled). */
  dismissible?: boolean
  closeButtonDisabled?: boolean
}

export const Modal = ({
  isOpen,
  title,
  children,
  footer,
  onClose,
  closeAriaLabel = 'Close modal',
  width = 'lg',
  dismissible = true,
  closeButtonDisabled = false,
}: Readonly<ModalProps>) => {
  useEffect(() => {
    if (!isOpen) {
      return
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) {
      return
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && dismissible) {
        onClose()
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [isOpen, onClose, dismissible])

  const root = useMemo(() => {
    if (typeof document === 'undefined') {
      return null
    }
    return document.body
  }, [])

  if (!root || !isOpen) {
    return null
  }

  const handleBackdropClick = (event: MouseEvent<HTMLDivElement>) => {
    if (!dismissible) {
      return
    }
    if (event.target === event.currentTarget) {
      onClose()
    }
  }

  return createPortal(
    <div
      className={cn.backdrop}
      onClick={handleBackdropClick}
      role="presentation"
    >
      <section
        className={classNames(
          cn.panel,
          width === 'sm' ? cn.panelSm : null,
          width === 'md' ? cn.panelMd : cn.panelLg,
        )}
        role="dialog"
        aria-modal="true"
        aria-label={typeof title === 'string' ? title : 'Modal dialog'}
      >
        <header className={cn.header}>
          {title ? <h2 className={cn.title}>{title}</h2> : <div />}
          <button
            type="button"
            className={cn.closeButton}
            aria-label={closeAriaLabel}
            disabled={closeButtonDisabled}
            onClick={onClose}
          >
            <IconX size={28} stroke={1.9} />
          </button>
        </header>
        <div className={cn.body}>{children}</div>
        {footer ? <footer className={cn.footer}>{footer}</footer> : null}
      </section>
    </div>,
    root,
  )
}
