import cn from './meme-delete-confirm-modal.module.css'

import type { MemeItem } from '../../model/memes'
import {
  MEMES_DELETE_CANCEL,
  MEMES_DELETE_CONFIRM,
  MEMES_DELETE_MODAL_BODY,
  MEMES_DELETE_MODAL_TITLE,
  MEMES_DELETE_PENDING,
} from '../../model/memes'
import { Modal } from '@shared/ui'

interface MemeDeleteConfirmModalProps {
  errorMessage: string | null
  isOpen: boolean
  isPending: boolean
  meme: MemeItem | null
  onClose: () => void
  onConfirm: () => void
}

export const MemeDeleteConfirmModal = ({
  errorMessage,
  isOpen,
  isPending,
  meme,
  onClose,
  onConfirm,
}: Readonly<MemeDeleteConfirmModalProps>) => {
  const dismissible = !isPending

  return (
    <Modal
      isOpen={isOpen && Boolean(meme)}
      title={MEMES_DELETE_MODAL_TITLE}
      width="sm"
      dismissible={dismissible}
      closeButtonDisabled={isPending}
      closeAriaLabel={MEMES_DELETE_CANCEL}
      onClose={onClose}
      footer={
        <div className={cn.footer}>
          <button
            type="button"
            className={cn.cancelButton}
            disabled={isPending}
            onClick={onClose}
          >
            {MEMES_DELETE_CANCEL}
          </button>
          <button
            type="button"
            className={cn.deleteButton}
            disabled={isPending}
            onClick={onConfirm}
          >
            {isPending ? MEMES_DELETE_PENDING : MEMES_DELETE_CONFIRM}
          </button>
        </div>
      }
    >
      <>
        <p className={cn.body}>{MEMES_DELETE_MODAL_BODY}</p>
        {meme ? (
          <p className={cn.body} style={{ marginTop: 12, fontWeight: 600 }}>
            {meme.name}
          </p>
        ) : null}
        {errorMessage ? (
          <div className={cn.errorBox} role="alert">
            {errorMessage}
          </div>
        ) : null}
      </>
    </Modal>
  )
}
