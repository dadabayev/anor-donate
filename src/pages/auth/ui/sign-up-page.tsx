import cn from './auth-page.module.css'

import {
  formatUzbekistanPhoneInput,
  UZBEKISTAN_PHONE_PLACEHOLDER,
} from '../lib/format-uzbekistan-phone'
import {
  type SignUpFormInputValues,
  type SignUpFormValues,
  signUpSchema,
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
import { startTransition, useId, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'

export const SignUpPage = () => {
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
      const result = await submitSignUp(values)

      startTransition(() => {
        navigate(result.redirectTo, {
          state: { phone: values.phone, flow: 'sign-up' },
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

      setSubmitError('Ro‘yxatdan o‘tishda kutilmagan xatolik yuz berdi.')
    }
  })

  return (
    <AuthShell title="Ro’yxatdan o’tish" align="top">
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
            label="Ism"
            placeholder="Ism"
            error={errors.firstName?.message}
          />
          <AuthInputField
            {...register('lastName')}
            id={lastNameId}
            label="Familya"
            placeholder="Familya"
            error={errors.lastName?.message}
          />
          <AuthInputField
            {...register('username')}
            id={usernameId}
            label="Username"
            placeholder="Username"
            autoComplete="username"
            error={errors.username?.message}
          />
          <AuthInputField
            {...register('email')}
            id={emailId}
            type="email"
            label="Elektron pochta"
            placeholder="example@email.com"
            autoComplete="email"
            error={errors.email?.message}
          />
          <AuthInputField
            {...register('channelName')}
            id={channelNameId}
            label="Kanalingiz nomi"
            placeholder="Kanal nomi"
            error={errors.channelName?.message}
          />
          <AuthInputField
            {...register('channelLink')}
            id={channelLinkId}
            type="url"
            label="Kanalingiz havolasi (ssilkasi)"
            placeholder="https://www.youtube.com/@your_channel"
            error={errors.channelLink?.message}
          />
          <AuthTextareaField
            {...register('about')}
            id={aboutId}
            label="Kanal haqida"
            placeholder="Kanal kontenti haqida qisqacha yozing"
            error={errors.about?.message}
            className={cn.wideField}
          />
          <Controller
            name="screenshot"
            control={control}
            render={({ field }) => (
              <div className={cn.wideField}>
                <AuthFileUploadField
                  label="Kanalingiz sozlamalaridan rasm (screenshot)"
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
                label="Telefon raqam"
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
            label="Parol"
            placeholder="Password"
            autoComplete="new-password"
            error={errors.password?.message}
          />
          <AuthInputField
            {...register('confirmPassword')}
            id={confirmPasswordId}
            type="password"
            label="Parol takrolang"
            placeholder="Password"
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
                  Men{' '}
                  <Link to="/" className={cn.inlineLink}>
                    Anor Donate xizmat ko‘rsatish shartlari va maxfiylik
                    siyosati
                  </Link>{' '}
                  bilan tanishib, ularga rozilik bildiraman.
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
              label="Men Anor Donate’dan maxsus takliflar, foydali maslahatlar va yangiliklarni olishga roziman."
            />
          )}
        />

        <AuthSubmitButton loading={isSubmitting}>
          Ro’yxatdan o’tish
        </AuthSubmitButton>
      </form>

      <div className={cn.bottomRow}>
        <span>Hisobingiz mavjudmi?</span>
        <Link to="/sign-in" className={cn.bottomLink}>
          Kirish
        </Link>
      </div>
    </AuthShell>
  )
}
