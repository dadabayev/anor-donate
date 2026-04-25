import cn from './auth-page.module.css'

import {
  createOtpSmsSchema,
  EMPTY_OTP_CODE,
  type OtpSmsFormValues,
} from '../model/auth-schema'
import {
  AuthSubmissionError,
  resendOtpCode,
  verifyOtpCode,
} from '../model/auth-service'
import { AuthOtpField, AuthShell, AuthSubmitButton } from './components'
import { zodResolver } from '@hookform/resolvers/zod'
import { startTransition, useMemo, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

export const OtpSmsPage = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [resendMessage, setResendMessage] = useState<string | null>(null)
  const [isResending, setIsResending] = useState(false)
  const otpSmsSchema = useMemo(() => createOtpSmsSchema(t), [t])
  const {
    control,
    handleSubmit,
    setError,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<OtpSmsFormValues>({
    resolver: zodResolver(otpSmsSchema),
    mode: 'onBlur',
    defaultValues: {
      code: [...EMPTY_OTP_CODE],
    },
  })

  const onSubmit = handleSubmit(async (values) => {
    setSubmitError(null)
    setResendMessage(null)

    try {
      const result = await verifyOtpCode(values)

      startTransition(() => {
        navigate(result.redirectTo)
      })
    } catch (error) {
      if (error instanceof AuthSubmissionError) {
        setSubmitError(error.message)

        Object.entries(error.fieldErrors).forEach(([fieldName, message]) => {
          setError(fieldName as keyof OtpSmsFormValues, { message })
        })

        return
      }

      setSubmitError(t('auth.otp.unexpectedError'))
    }
  })

  const handleResend = async () => {
    setSubmitError(null)
    setResendMessage(null)
    setIsResending(true)

    try {
      await resendOtpCode()
      setValue('code', [...EMPTY_OTP_CODE], { shouldValidate: true })
      setResendMessage(t('auth.otp.resendSuccess'))
    } catch {
      setSubmitError(t('auth.otp.resendError'))
    } finally {
      setIsResending(false)
    }
  }

  return (
    <AuthShell title={t('auth.otp.title')} variant="otp">
      {submitError ? (
        <div className={cn.alert} role="alert">
          {submitError}
        </div>
      ) : null}

      <form className={cn.form} noValidate onSubmit={onSubmit}>
        <Controller
          name="code"
          control={control}
          render={({ field }) => (
            <AuthOtpField
              label={t('auth.otp.codeLabel')}
              value={field.value}
              error={errors.code?.message}
              disabled={isSubmitting || isResending}
              onChange={field.onChange}
            />
          )}
        />

        <div className={cn.otpActions}>
          <button
            type="button"
            className={cn.textButton}
            disabled={isSubmitting || isResending}
            onClick={handleResend}
          >
            {t('auth.otp.resend')}
          </button>
          {resendMessage ? (
            <span className={cn.resendNote}>{resendMessage}</span>
          ) : null}
        </div>

        <AuthSubmitButton loading={isSubmitting}>
          {t('auth.otp.confirm')}
        </AuthSubmitButton>
      </form>
    </AuthShell>
  )
}
