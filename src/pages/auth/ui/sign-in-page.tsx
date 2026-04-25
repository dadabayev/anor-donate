import cn from './auth-page.module.css'

import { createSignInSchema, type SignInFormValues } from '../model/auth-schema'
import { AuthSubmissionError, submitSignIn } from '../model/auth-service'
import {
  AuthCheckboxField,
  AuthInputField,
  AuthShell,
  AuthSubmitButton,
} from './components'
import { zodResolver } from '@hookform/resolvers/zod'
import { getRoleHomePath, setAuthSession } from '@shared/lib'
import { useMutation } from '@tanstack/react-query'
import classNames from 'classnames'
import { startTransition, useId, useMemo, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Link, useNavigate } from 'react-router-dom'

export const SignInPage = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const loginId = useId()
  const passwordId = useId()
  const rememberId = useId()
  const [submitError, setSubmitError] = useState<string | null>(null)
  const signInSchema = useMemo(() => createSignInSchema(t), [t])
  const signInMutation = useMutation({
    mutationFn: submitSignIn,
  })
  const {
    register,
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    mode: 'onBlur',
    defaultValues: {
      login: '',
      password: '',
      rememberMe: false,
    },
  })

  const onSubmit = handleSubmit(async (values) => {
    setSubmitError(null)

    try {
      const result = await signInMutation.mutateAsync(values)
      setAuthSession(result.session)
      const redirectTo = getRoleHomePath(result.session.role)

      startTransition(() => {
        navigate(redirectTo)
      })
    } catch (error) {
      if (error instanceof AuthSubmissionError) {
        setSubmitError(error.message)

        Object.entries(error.fieldErrors).forEach(([fieldName, message]) => {
          setError(fieldName as keyof SignInFormValues, { message })
        })

        return
      }

      setSubmitError(t('auth.signIn.unexpectedError'))
    }
  })

  return (
    <AuthShell title={t('auth.signIn.title')} variant="signIn">
      {submitError ? (
        <div className={cn.alert} role="alert">
          {submitError}
        </div>
      ) : null}

      <form className={cn.form} noValidate onSubmit={onSubmit}>
        <AuthInputField
          {...register('login')}
          id={loginId}
          label={t('auth.signIn.loginLabel')}
          placeholder="example@gmail.com"
          autoComplete="username"
          error={errors.login?.message}
        />

        <AuthInputField
          {...register('password')}
          id={passwordId}
          type="password"
          label={t('auth.signIn.passwordLabel')}
          placeholder={t('auth.signIn.passwordPlaceholder')}
          autoComplete="current-password"
          error={errors.password?.message}
          footer={
            <Link
              to="/reset-password"
              className={classNames(cn.footerLink, cn.rememberForgotLink)}
            >
              {t('auth.signIn.forgotPassword')}
            </Link>
          }
        />

        <div className={cn.rememberForgotRow}>
          <Controller
            name="rememberMe"
            control={control}
            render={({ field }) => (
              <AuthCheckboxField
                id={rememberId}
                checked={field.value}
                name={field.name}
                label={t('auth.signIn.rememberMe')}
                onBlur={field.onBlur}
                onChange={(event) => field.onChange(event.target.checked)}
              />
            )}
          />
        </div>

        <AuthSubmitButton loading={isSubmitting}>
          {t('auth.signIn.submit')}
        </AuthSubmitButton>
      </form>

      <div className={cn.bottomRow}>
        <span>{t('auth.signIn.bottomPrompt')}</span>
        <Link to="/sign-up" className={cn.bottomLink}>
          {t('auth.signIn.bottomLink')}
        </Link>
      </div>
    </AuthShell>
  )
}
