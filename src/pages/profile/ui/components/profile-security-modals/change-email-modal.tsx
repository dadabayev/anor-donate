import cn from './profile-security-modal.module.css'

import { getErrorMessage, isEmailValid } from './security-modal-utils'
import type { SecurityModalLabels } from './types'
import { Modal } from '@shared/ui'
import { useState } from 'react'

interface ChangeEmailModalProps {
  isBusy: boolean
  initialEmail: string
  labels: Pick<
    SecurityModalLabels,
    | 'emailTitle'
    | 'emailLabel'
    | 'submit'
    | 'submitting'
    | 'close'
    | 'invalidEmail'
  >
  onClose: () => void
  onSubmit: (email: string) => Promise<void>
}

export const ChangeEmailModal = ({
  isBusy,
  initialEmail,
  labels,
  onClose,
  onSubmit,
}: Readonly<ChangeEmailModalProps>) => {
  const [emailValue, setEmailValue] = useState(initialEmail)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const handleClose = () => {
    if (isBusy) {
      return
    }
    onClose()
  }

  const handleSubmit = async () => {
    const value = emailValue.trim()
    if (!isEmailValid(value)) {
      setSubmitError(labels.invalidEmail)
      return
    }

    setSubmitError(null)
    try {
      await onSubmit(value)
    } catch (error) {
      setSubmitError(getErrorMessage(error, labels.invalidEmail))
    }
  }

  return (
    <Modal
      isOpen
      onClose={handleClose}
      title={labels.emailTitle}
      closeAriaLabel={labels.close}
      width="lg"
      footer={
        <button
          type="button"
          className={cn.modalSaveButton}
          onClick={handleSubmit}
          disabled={isBusy}
        >
          {isBusy ? labels.submitting : labels.submit}
        </button>
      }
    >
      <div className={cn.modalBody}>
        <label className={cn.label} htmlFor="profile-email-change">
          {labels.emailLabel}
        </label>
        <div className={cn.inputShell}>
          <input
            id="profile-email-change"
            className={cn.input}
            value={emailValue}
            onChange={(event) => setEmailValue(event.target.value)}
            disabled={isBusy}
            placeholder="example@example.com"
            autoComplete="email"
          />
        </div>
        {submitError ? <p className={cn.errorText}>{submitError}</p> : null}
      </div>
    </Modal>
  )
}
