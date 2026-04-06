import cn from '../auth-page.module.css'

import classNames from 'classnames'
import { useRef } from 'react'

interface AuthOtpFieldProps {
  label: string
  value: string[]
  error?: string
  disabled?: boolean
  onChange: (value: string[]) => void
}

const OTP_GROUPS = [
  [0, 1, 2],
  [3, 4, 5],
] as const

export const AuthOtpField = ({
  label,
  value,
  error,
  disabled,
  onChange,
}: Readonly<AuthOtpFieldProps>) => {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  const focusInput = (index: number) => {
    inputRefs.current[index]?.focus()
    inputRefs.current[index]?.select()
  }

  const updateDigits = (nextDigits: string[]) => {
    onChange(nextDigits.map((digit) => digit.replace(/\D/g, '').slice(0, 1)))
  }

  const handleDigitChange = (index: number, nextValue: string) => {
    const digits = nextValue.replace(/\D/g, '')

    if (!digits) {
      const clearedDigits = [...value]
      clearedDigits[index] = ''
      updateDigits(clearedDigits)
      return
    }

    const nextDigits = [...value]

    digits.split('').forEach((digit, digitOffset) => {
      const nextIndex = index + digitOffset

      if (nextIndex < nextDigits.length) {
        nextDigits[nextIndex] = digit
      }
    })

    updateDigits(nextDigits)
    focusInput(Math.min(index + digits.length, value.length - 1))
  }

  const handleKeyDown = (
    index: number,
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key === 'Backspace') {
      event.preventDefault()

      const nextDigits = [...value]

      if (nextDigits[index]) {
        nextDigits[index] = ''
        updateDigits(nextDigits)
        return
      }

      if (index > 0) {
        nextDigits[index - 1] = ''
        updateDigits(nextDigits)
        focusInput(index - 1)
      }
    }

    if (event.key === 'ArrowLeft' && index > 0) {
      event.preventDefault()
      focusInput(index - 1)
    }

    if (event.key === 'ArrowRight' && index < value.length - 1) {
      event.preventDefault()
      focusInput(index + 1)
    }
  }

  const handlePaste = (
    event: React.ClipboardEvent<HTMLInputElement>,
    index: number,
  ) => {
    event.preventDefault()

    const pastedDigits = event.clipboardData.getData('text').replace(/\D/g, '')

    if (!pastedDigits) {
      return
    }

    const nextDigits = [...value]

    pastedDigits.split('').forEach((digit, digitOffset) => {
      const nextIndex = index + digitOffset

      if (nextIndex < nextDigits.length) {
        nextDigits[nextIndex] = digit
      }
    })

    updateDigits(nextDigits)
    focusInput(Math.min(index + pastedDigits.length, value.length - 1))
  }

  return (
    <div className={cn.otpField}>
      <span className={cn.label}>{label}</span>
      <div className={cn.otpRow}>
        {OTP_GROUPS.map((group, groupIndex) => (
          <div key={groupIndex} className={cn.otpGroup}>
            {group.map((inputIndex) => (
              <input
                key={inputIndex}
                ref={(element) => {
                  inputRefs.current[inputIndex] = element
                }}
                type="text"
                inputMode="numeric"
                autoComplete={inputIndex === 0 ? 'one-time-code' : 'off'}
                className={classNames(cn.otpInput, error && cn.otpInputError)}
                value={value[inputIndex] ?? ''}
                disabled={disabled}
                aria-label={`${label} ${inputIndex + 1}`}
                onChange={(event) =>
                  handleDigitChange(inputIndex, event.target.value)
                }
                onKeyDown={(event) => handleKeyDown(inputIndex, event)}
                onFocus={(event) => event.currentTarget.select()}
                onPaste={(event) => handlePaste(event, inputIndex)}
              />
            ))}
          </div>
        ))}
      </div>
      {error ? <span className={cn.error}>{error}</span> : null}
    </div>
  )
}
