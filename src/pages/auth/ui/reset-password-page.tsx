import cn from './auth-page.module.css'

import {
  formatUzbekistanPhoneInput,
  UZBEKISTAN_PHONE_PLACEHOLDER,
} from '../lib/format-uzbekistan-phone'
import {
  type ResetPasswordFormValues,
  resetPasswordSchema,
} from '../model/auth-schema'
import {
  AuthSubmissionError,
  requestPasswordReset,
} from '../model/auth-service'
import { AuthInputField, AuthShell, AuthSubmitButton } from './components'
import { zodResolver } from '@hookform/resolvers/zod'
import { startTransition, useId, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'

export const ResetPasswordPage = () => {
  const navigate = useNavigate()
  const phoneId = useId()
  const [submitError, setSubmitError] = useState<string | null>(null)
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
          state: { phone: values.phone, flow: 'reset-password' },
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

      setSubmitError('Kod yuborishda kutilmagan xatolik yuz berdi.')
    }
  })

  return (
    <AuthShell title="Parolni tiklash">
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
              label="Telefon raqam"
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

        <AuthSubmitButton loading={isSubmitting}>Kodni olish</AuthSubmitButton>
      </form>
    </AuthShell>
  )
}
