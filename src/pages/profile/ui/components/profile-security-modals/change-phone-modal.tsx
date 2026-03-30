import cn from './profile-security-modal.module.css'

import { getErrorMessage, UZBEKISTAN_PHONE_REGEX } from './security-modal-utils'
import type { SecurityModalLabels } from './types'
import { Modal } from '@shared/ui'
import { useState } from 'react'

interface ChangePhoneModalProps {
  isBusy: boolean
  initialPhone: string
  labels: Pick<
    SecurityModalLabels,
    | 'phoneTitle'
    | 'phoneLabel'
    | 'submit'
    | 'submitting'
    | 'close'
    | 'invalidPhone'
  >
  onClose: () => void
  onSubmit: (phone: string) => Promise<void>
}

export const ChangePhoneModal = ({
  isBusy,
  initialPhone,
  labels,
  onClose,
  onSubmit,
}: Readonly<ChangePhoneModalProps>) => {
  const [phoneValue, setPhoneValue] = useState(initialPhone)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const handleClose = () => {
    if (isBusy) {
      return
    }
    onClose()
  }

  const handleSubmit = async () => {
    const value = phoneValue.trim()
    if (!UZBEKISTAN_PHONE_REGEX.test(value)) {
      setSubmitError(labels.invalidPhone)
      return
    }

    setSubmitError(null)
    try {
      await onSubmit(value)
    } catch (error) {
      setSubmitError(getErrorMessage(error, labels.invalidPhone))
    }
  }

  return (
    <Modal
      isOpen
      onClose={handleClose}
      title={labels.phoneTitle}
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
        <label className={cn.label} htmlFor="profile-phone-change">
          {labels.phoneLabel}
        </label>
        <div className={cn.inputShell}>
          <input
            id="profile-phone-change"
            className={cn.input}
            value={phoneValue}
            onChange={(event) => setPhoneValue(event.target.value)}
            disabled={isBusy}
            placeholder="+998 (99) 000-00-00"
            autoComplete="tel"
          />
        </div>
        {submitError ? <p className={cn.errorText}>{submitError}</p> : null}
      </div>
    </Modal>
  )
}
