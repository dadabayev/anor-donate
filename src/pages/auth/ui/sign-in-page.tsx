import cn from './auth-page.module.css'

import { type SignInFormValues, signInSchema } from '../model/auth-schema'
import { AuthSubmissionError, submitSignIn } from '../model/auth-service'
import {
  AuthCheckboxField,
  AuthInputField,
  AuthShell,
  AuthSubmitButton,
} from './components'
import { zodResolver } from '@hookform/resolvers/zod'
import { startTransition, useId, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'

export const SignInPage = () => {
  const navigate = useNavigate()
  const loginId = useId()
  const passwordId = useId()
  const rememberId = useId()
  const [submitError, setSubmitError] = useState<string | null>(null)
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
      const result = await submitSignIn(values)

      startTransition(() => {
        navigate(result.redirectTo)
      })
    } catch (error) {
      if (error instanceof AuthSubmissionError) {
        setSubmitError(error.message)

        Object.entries(error.fieldErrors).forEach(([fieldName, message]) => {
          setError(fieldName as keyof SignInFormValues, { message })
        })

        return
      }

      setSubmitError('Kirish vaqtida kutilmagan xatolik yuz berdi.')
    }
  })

  return (
    <AuthShell title="Hisobga kirish">
      {submitError ? (
        <div className={cn.alert} role="alert">
          {submitError}
        </div>
      ) : null}

      <form className={cn.form} noValidate onSubmit={onSubmit}>
        <AuthInputField
          {...register('login')}
          id={loginId}
          label="Login/Pochta"
          placeholder="example@gmail.com"
          autoComplete="username"
          error={errors.login?.message}
        />

        <AuthInputField
          {...register('password')}
          id={passwordId}
          type="password"
          label="Parol"
          placeholder="Password"
          autoComplete="current-password"
          error={errors.password?.message}
          footer={
            <Link to="/reset-password" className={cn.footerLink}>
              Parolni unutdingizmi?
            </Link>
          }
        />

        <Controller
          name="rememberMe"
          control={control}
          render={({ field }) => (
            <AuthCheckboxField
              id={rememberId}
              checked={field.value}
              name={field.name}
              label="Meni eslab qolish"
              onBlur={field.onBlur}
              onChange={(event) => field.onChange(event.target.checked)}
            />
          )}
        />

        <AuthSubmitButton loading={isSubmitting}>Kirish</AuthSubmitButton>
      </form>

      <div className={cn.bottomRow}>
        <span>Hali ro‘yxatdan o‘tmaganmisiz?</span>
        <Link to="/sign-up" className={cn.bottomLink}>
          Ro‘yxatdan o‘tish
        </Link>
      </div>
    </AuthShell>
  )
}
