import cn from './confirm-modal.module.css'

import { Modal } from '@shared/ui'
import classNames from 'classnames'
import { type ReactNode, useCallback, useEffect, useState } from 'react'

export interface ConfirmModalProps {
  isOpen: boolean
  title: string
  message: ReactNode
  confirmLabel: string
  cancelLabel: string
  /** Shown on the confirm button while `onConfirm` is in flight. */
  confirmingLabel?: string
  closeAriaLabel: string
  onConfirm: () => void | Promise<void>
  onCancel: () => void
  /** Use neutral styling for non-destructive confirmations. */
  variant?: 'danger' | 'neutral'
}

export const ConfirmModal = ({
  isOpen,
  title,
  message,
  confirmLabel,
  cancelLabel,
  confirmingLabel,
  closeAriaLabel,
  onConfirm,
  onCancel,
  variant = 'danger',
}: Readonly<ConfirmModalProps>) => {
  const [isBusy, setIsBusy] = useState(false)

  useEffect(() => {
    if (!isOpen) {
      setIsBusy(false)
    }
  }, [isOpen])

  const handleClose = useCallback(() => {
    if (isBusy) {
      return
    }
    onCancel()
  }, [isBusy, onCancel])

  const handleConfirm = useCallback(async () => {
    if (isBusy) {
      return
    }
    setIsBusy(true)
    try {
      await onConfirm()
    } finally {
      setIsBusy(false)
    }
  }, [isBusy, onConfirm])

  return (
    <Modal
      isOpen={isOpen}
      title={title}
      closeAriaLabel={closeAriaLabel}
      width="sm"
      dismissible={!isBusy}
      closeButtonDisabled={isBusy}
      onClose={handleClose}
      footer={
        <div className={cn.footerActions}>
          <button
            type="button"
            className={cn.cancelButton}
            disabled={isBusy}
            onClick={handleClose}
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            className={classNames(
              cn.confirmButton,
              variant === 'neutral' && cn.confirmButtonMuted,
            )}
            disabled={isBusy}
            onClick={() => {
              void handleConfirm()
            }}
          >
            {isBusy ? (confirmingLabel ?? confirmLabel) : confirmLabel}
          </button>
        </div>
      }
    >
      <div className={cn.message}>{message}</div>
    </Modal>
  )
}
