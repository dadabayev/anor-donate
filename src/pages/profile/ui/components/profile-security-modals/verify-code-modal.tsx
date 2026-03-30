import cn from './profile-security-modal.module.css'

import {
  buildEmptyOtpDigits,
  getErrorMessage,
  OTP_LENGTH,
  toTimer,
} from './security-modal-utils'
import type { SecurityModalLabels } from './types'
import { Modal } from '@shared/ui'
import { useEffect, useMemo, useRef, useState } from 'react'

interface VerifyCodeModalProps {
  isBusy: boolean
  verifySecondsLeft: number
  labels: Pick<
    SecurityModalLabels,
    | 'verificationTitle'
    | 'verifyResend'
    | 'verifyTimerPrefix'
    | 'submit'
    | 'submitting'
    | 'close'
    | 'invalidVerificationCode'
  >
  onClose: () => void
  onSubmit: (code: string) => Promise<void>
  onResend: () => Promise<void>
}

export const VerifyCodeModal = ({
  isBusy,
  verifySecondsLeft,
  labels,
  onClose,
  onSubmit,
  onResend,
}: Readonly<VerifyCodeModalProps>) => {
  const [otpDigits, setOtpDigits] = useState<string[]>(buildEmptyOtpDigits())
  const [submitError, setSubmitError] = useState<string | null>(null)
  const otpRefs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    otpRefs.current[0]?.focus()
  }, [])

  const verifyTimer = useMemo(
    () => `${labels.verifyTimerPrefix} ${toTimer(verifySecondsLeft)}`,
    [labels.verifyTimerPrefix, verifySecondsLeft],
  )

  const handleClose = () => {
    if (isBusy) {
      return
    }
    onClose()
  }

  const handleOtpChange = (index: number, rawValue: string) => {
    const nextDigit = rawValue.replace(/\D/g, '').slice(-1)
    setOtpDigits((current) => {
      const next = [...current]
      next[index] = nextDigit
      return next
    })

    if (nextDigit && index < OTP_LENGTH - 1) {
      otpRefs.current[index + 1]?.focus()
    }
  }

  const handleOtpKeyDown = (index: number, key: string) => {
    if (key === 'Backspace' && !otpDigits[index] && index > 0) {
      otpRefs.current[index - 1]?.focus()
    }
    if (key === 'ArrowLeft' && index > 0) {
      otpRefs.current[index - 1]?.focus()
    }
    if (key === 'ArrowRight' && index < OTP_LENGTH - 1) {
      otpRefs.current[index + 1]?.focus()
    }
  }

  const handleOtpPaste = (value: string) => {
    const pasted = value.replace(/\D/g, '').slice(0, OTP_LENGTH)
    if (!pasted) {
      return
    }
    const next = Array.from({ length: OTP_LENGTH }, (_, index) => {
      return pasted[index] ?? ''
    })
    setOtpDigits(next)
    const focusIndex = Math.min(pasted.length, OTP_LENGTH - 1)
    otpRefs.current[focusIndex]?.focus()
  }

  const handleSubmitVerification = async () => {
    const code = otpDigits.join('')
    if (code.length !== OTP_LENGTH) {
      setSubmitError(labels.invalidVerificationCode)
      return
    }

    setSubmitError(null)
    try {
      await onSubmit(code)
    } catch (error) {
      setSubmitError(getErrorMessage(error, labels.invalidVerificationCode))
    }
  }

  const handleResend = async () => {
    if (verifySecondsLeft > 0) {
      return
    }
    setSubmitError(null)
    try {
      await onResend()
    } catch (error) {
      setSubmitError(getErrorMessage(error, labels.invalidVerificationCode))
    }
  }

  return (
    <Modal
      isOpen
      onClose={handleClose}
      title={labels.verificationTitle}
      closeAriaLabel={labels.close}
      width="sm"
      footer={
        <div className={cn.verifyModalFooter}>
          <button
            type="button"
            className={cn.modalSaveButton}
            onClick={handleSubmitVerification}
            disabled={isBusy}
          >
            {isBusy ? labels.submitting : labels.submit}
          </button>
        </div>
      }
    >
      <div className={cn.verifyModalBody}>
        <div className={cn.otpGrid}>
          {otpDigits.map((digit, index) => (
            <input
              key={`otp-${index}`}
              ref={(node) => {
                otpRefs.current[index] = node
              }}
              className={cn.otpInput}
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={1}
              value={digit}
              onChange={(event) => handleOtpChange(index, event.target.value)}
              onKeyDown={(event) => handleOtpKeyDown(index, event.key)}
              onPaste={(event) => {
                event.preventDefault()
                handleOtpPaste(event.clipboardData.getData('text'))
              }}
              disabled={isBusy}
            />
          ))}
        </div>

        <div className={cn.verifyMetaRow}>
          <button
            type="button"
            className={cn.verifyResendButton}
            disabled={isBusy || verifySecondsLeft > 0}
            onClick={handleResend}
          >
            {labels.verifyResend}
          </button>
          <span className={cn.verifyTimer}>{verifyTimer}</span>
        </div>

        {submitError ? <p className={cn.errorText}>{submitError}</p> : null}
      </div>
    </Modal>
  )
}
