import cn from './auth-page.module.css'

import {
  formatUzbekistanPhoneInput,
  UZBEKISTAN_PHONE_PLACEHOLDER,
} from '../lib/format-uzbekistan-phone'
import {
  createSignUpSchema,
  type SignUpFormInputValues,
  type SignUpFormValues,
} from '../model/auth-schema'
import { AuthSubmissionError, submitSignUp } from '../model/auth-service'
import {
  AuthCheckboxField,
  AuthFileUploadField,
  AuthInputField,
  AuthShell,
  AuthSubmitButton,
  AuthTextareaField,
} from './components'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { startTransition, useId, useMemo, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Link, useNavigate } from 'react-router-dom'

export const SignUpPage = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const firstNameId = useId()
  const lastNameId = useId()
  const usernameId = useId()
  const emailId = useId()
  const channelNameId = useId()
  const channelLinkId = useId()
  const aboutId = useId()
  const phoneId = useId()
  const passwordId = useId()
  const confirmPasswordId = useId()
  const acceptTermsId = useId()
  const marketingConsentId = useId()
  const [submitError, setSubmitError] = useState<string | null>(null)
  const signUpSchema = useMemo(() => createSignUpSchema(t), [t])
  const signUpMutation = useMutation({
    mutationFn: submitSignUp,
  })
  const {
    register,
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<SignUpFormInputValues, undefined, SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    mode: 'onBlur',
    defaultValues: {
      firstName: '',
      lastName: '',
      username: '',
      email: '',
      channelName: '',
      channelLink: '',
      about: '',
      screenshot: null,
      phone: '+998',
      password: '',
      confirmPassword: '',
      acceptTerms: false,
      marketingConsent: false,
    },
  })

  const onSubmit = handleSubmit(async (values) => {
    setSubmitError(null)

    try {
      const result = await signUpMutation.mutateAsync(values)

      startTransition(() => {
        navigate(result.redirectTo, {
          state: {
            phone: values.phone,
            phoneE164: result.phoneE164,
            flow: 'sign-up',
          },
        })
      })
    } catch (error) {
      if (error instanceof AuthSubmissionError) {
        setSubmitError(error.message)

        Object.entries(error.fieldErrors).forEach(([fieldName, message]) => {
          setError(fieldName as keyof SignUpFormValues, { message })
        })

        return
      }

      setSubmitError(t('auth.signUp.unexpectedError'))
    }
  })

  return (
    <AuthShell title={t('auth.signUp.title')} align="top" variant="signUp">
      {submitError ? (
        <div className={cn.alert} role="alert">
          {submitError}
        </div>
      ) : null}

      <form className={cn.form} noValidate onSubmit={onSubmit}>
        <div className={cn.formGrid}>
          <AuthInputField
            {...register('firstName')}
            id={firstNameId}
            label={t('auth.signUp.firstName')}
            placeholder={t('auth.signUp.firstNamePlaceholder')}
            error={errors.firstName?.message}
          />
          <AuthInputField
            {...register('lastName')}
            id={lastNameId}
            label={t('auth.signUp.lastName')}
            placeholder={t('auth.signUp.lastNamePlaceholder')}
            error={errors.lastName?.message}
          />
          <AuthInputField
            {...register('username')}
            id={usernameId}
            label={t('auth.signUp.username')}
            placeholder={t('auth.signUp.usernamePlaceholder')}
            autoComplete="username"
            error={errors.username?.message}
          />
          <AuthInputField
            {...register('email')}
            id={emailId}
            type="email"
            label={t('auth.signUp.email')}
            placeholder={t('auth.signUp.emailPlaceholder')}
            autoComplete="email"
            error={errors.email?.message}
          />
          <AuthInputField
            {...register('channelName')}
            id={channelNameId}
            label={t('auth.signUp.channelName')}
            placeholder={t('auth.signUp.channelPlaceholder')}
            error={errors.channelName?.message}
          />
          <AuthInputField
            {...register('channelLink')}
            id={channelLinkId}
            type="url"
            label={t('auth.signUp.channelLink')}
            placeholder={t('auth.signUp.channelLinkPlaceholder')}
            error={errors.channelLink?.message}
          />
          <AuthTextareaField
            {...register('about')}
            id={aboutId}
            label={t('auth.signUp.about')}
            placeholder={t('auth.signUp.aboutPlaceholder')}
            error={errors.about?.message}
            className={cn.wideField}
          />
          <Controller
            name="screenshot"
            control={control}
            render={({ field }) => (
              <div className={cn.wideField}>
                <AuthFileUploadField
                  label={t('auth.signUp.screenshotLabel')}
                  fileName={field.value?.name}
                  error={errors.screenshot?.message}
                  disabled={isSubmitting}
                  onChange={field.onChange}
                />
              </div>
            )}
          />
          <Controller
            name="phone"
            control={control}
            render={({ field }) => (
              <AuthInputField
                id={phoneId}
                label={t('auth.signUp.phone')}
                placeholder={UZBEKISTAN_PHONE_PLACEHOLDER}
                inputMode="numeric"
                autoComplete="tel"
                value={field.value}
                error={errors.phone?.message}
                className={cn.wideField}
                onChange={(event) =>
                  field.onChange(formatUzbekistanPhoneInput(event.target.value))
                }
              />
            )}
          />
          <AuthInputField
            {...register('password')}
            id={passwordId}
            type="password"
            label={t('auth.signUp.password')}
            placeholder={t('auth.signUp.passwordPlaceholder')}
            autoComplete="new-password"
            error={errors.password?.message}
          />
          <AuthInputField
            {...register('confirmPassword')}
            id={confirmPasswordId}
            type="password"
            label={t('auth.signUp.confirmPassword')}
            placeholder={t('auth.signUp.passwordPlaceholder')}
            autoComplete="new-password"
            error={errors.confirmPassword?.message}
          />
        </div>

        <Controller
          name="acceptTerms"
          control={control}
          render={({ field }) => (
            <AuthCheckboxField
              id={acceptTermsId}
              checked={field.value}
              error={errors.acceptTerms?.message}
              name={field.name}
              onBlur={field.onBlur}
              onChange={(event) => field.onChange(event.target.checked)}
              label={
                <>
                  {t('auth.signUp.acceptTermsPrefix')}{' '}
                  <Link to="/" className={cn.inlineLink}>
                    {t('auth.signUp.acceptTermsLink')}
                  </Link>
                  {t('auth.signUp.acceptTermsSuffix')}
                </>
              }
            />
          )}
        />

        <Controller
          name="marketingConsent"
          control={control}
          render={({ field }) => (
            <AuthCheckboxField
              id={marketingConsentId}
              checked={field.value}
              name={field.name}
              onBlur={field.onBlur}
              onChange={(event) => field.onChange(event.target.checked)}
              label={t('auth.signUp.marketingConsent')}
            />
          )}
        />

        <AuthSubmitButton loading={isSubmitting}>
          {t('auth.signUp.submit')}
        </AuthSubmitButton>
      </form>

      <div className={cn.bottomRow}>
        <span>{t('auth.signUp.bottomPrompt')}</span>
        <Link to="/sign-in" className={cn.bottomLink}>
          {t('auth.signUp.bottomLink')}
        </Link>
      </div>
    </AuthShell>
  )
}
