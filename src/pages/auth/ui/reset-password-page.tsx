import cn from './auth-page.module.css'

import {
  formatUzbekistanPhoneInput,
  UZBEKISTAN_PHONE_PLACEHOLDER,
} from '../lib/format-uzbekistan-phone'
import {
  createResetPasswordSchema,
  type ResetPasswordFormValues,
} from '../model/auth-schema'
import {
  AuthSubmissionError,
  requestPasswordReset,
} from '../model/auth-service'
import { AuthInputField, AuthShell, AuthSubmitButton } from './components'
import { zodResolver } from '@hookform/resolvers/zod'
import { startTransition, useId, useMemo, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

export const ResetPasswordPage = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const phoneId = useId()
  const [submitError, setSubmitError] = useState<string | null>(null)
  const resetPasswordSchema = useMemo(() => createResetPasswordSchema(t), [t])
  const {
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    mode: 'onBlur',
    defaultValues: {
      phone: '+998',
    },
  })

  const onSubmit = handleSubmit(async (values) => {
    setSubmitError(null)

    try {
      const result = await requestPasswordReset(values)

      startTransition(() => {
        navigate(result.redirectTo, {
          state: {
            phone: values.phone,
            phoneE164: result.phoneE164,
            flow: 'reset-password',
          },
        })
      })
    } catch (error) {
      if (error instanceof AuthSubmissionError) {
        setSubmitError(error.message)

        Object.entries(error.fieldErrors).forEach(([fieldName, message]) => {
          setError(fieldName as keyof ResetPasswordFormValues, { message })
        })

        return
      }

      setSubmitError(t('auth.resetPassword.unexpectedError'))
    }
  })

  return (
    <AuthShell title={t('auth.resetPassword.title')} variant="resetPassword">
      {submitError ? (
        <div className={cn.alert} role="alert">
          {submitError}
        </div>
      ) : null}

      <form className={cn.form} noValidate onSubmit={onSubmit}>
        <Controller
          name="phone"
          control={control}
          render={({ field }) => (
            <AuthInputField
              id={phoneId}
              label={t('auth.resetPassword.phoneLabel')}
              placeholder={UZBEKISTAN_PHONE_PLACEHOLDER}
              inputMode="numeric"
              autoComplete="tel"
              value={field.value}
              error={errors.phone?.message}
              onChange={(event) =>
                field.onChange(formatUzbekistanPhoneInput(event.target.value))
              }
            />
          )}
        />

        <AuthSubmitButton loading={isSubmitting}>
          {t('auth.resetPassword.submit')}
        </AuthSubmitButton>
      </form>
    </AuthShell>
  )
}
