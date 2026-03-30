import cn from './profile-security-modal.module.css'

import { getErrorMessage } from './security-modal-utils'
import type { SecurityModalLabels } from './types'
import { Modal } from '@shared/ui'
import { useState } from 'react'

interface ChangePasswordModalProps {
  isBusy: boolean
  labels: Pick<
    SecurityModalLabels,
    | 'passwordTitle'
    | 'currentPasswordLabel'
    | 'newPasswordLabel'
    | 'repeatPasswordLabel'
    | 'submit'
    | 'submitting'
    | 'close'
    | 'invalidCurrentPassword'
    | 'invalidNewPassword'
    | 'passwordMismatch'
  >
  onClose: () => void
  onSubmit: (currentPassword: string, newPassword: string) => Promise<void>
}

export const ChangePasswordModal = ({
  isBusy,
  labels,
  onClose,
  onSubmit,
}: Readonly<ChangePasswordModalProps>) => {
  const [currentPasswordValue, setCurrentPasswordValue] = useState('')
  const [newPasswordValue, setNewPasswordValue] = useState('')
  const [repeatPasswordValue, setRepeatPasswordValue] = useState('')
  const [submitError, setSubmitError] = useState<string | null>(null)

  const handleClose = () => {
    if (isBusy) {
      return
    }
    onClose()
  }

  const handleSubmit = async () => {
    if (!currentPasswordValue.trim()) {
      setSubmitError(labels.invalidCurrentPassword)
      return
    }
    if (newPasswordValue.trim().length < 8) {
      setSubmitError(labels.invalidNewPassword)
      return
    }
    if (newPasswordValue !== repeatPasswordValue) {
      setSubmitError(labels.passwordMismatch)
      return
    }

    setSubmitError(null)
    try {
      await onSubmit(currentPasswordValue, newPasswordValue)
    } catch (error) {
      setSubmitError(getErrorMessage(error, labels.invalidCurrentPassword))
    }
  }

  return (
    <Modal
      isOpen
      onClose={handleClose}
      title={labels.passwordTitle}
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
        <label className={cn.label} htmlFor="profile-password-current">
          {labels.currentPasswordLabel}
        </label>
        <div className={cn.inputShell}>
          <input
            id="profile-password-current"
            className={cn.input}
            value={currentPasswordValue}
            onChange={(event) => setCurrentPasswordValue(event.target.value)}
            disabled={isBusy}
            type="password"
            autoComplete="current-password"
          />
        </div>

        <div className={cn.modalFieldGrid}>
          <div className={cn.field}>
            <label className={cn.label} htmlFor="profile-password-next">
              {labels.newPasswordLabel}
            </label>
            <div className={cn.inputShell}>
              <input
                id="profile-password-next"
                className={cn.input}
                value={newPasswordValue}
                onChange={(event) => setNewPasswordValue(event.target.value)}
                disabled={isBusy}
                type="password"
                autoComplete="new-password"
              />
            </div>
          </div>

          <div className={cn.field}>
            <label className={cn.label} htmlFor="profile-password-repeat">
              {labels.repeatPasswordLabel}
            </label>
            <div className={cn.inputShell}>
              <input
                id="profile-password-repeat"
                className={cn.input}
                value={repeatPasswordValue}
                onChange={(event) => setRepeatPasswordValue(event.target.value)}
                disabled={isBusy}
                type="password"
                autoComplete="new-password"
              />
            </div>
          </div>
        </div>
        {submitError ? <p className={cn.errorText}>{submitError}</p> : null}
      </div>
    </Modal>
  )
}
