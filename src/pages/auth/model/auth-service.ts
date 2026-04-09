import type {
  OtpSmsFormValues,
  ResetPasswordFormValues,
  SignInFormValues,
  SignUpFormValues,
} from './auth-schema'
import i18n from 'i18next'

const simulateDelay = (timeout = 900) =>
  new Promise((resolve) => window.setTimeout(resolve, timeout))

type AuthFieldErrors = Record<string, string>

export class AuthSubmissionError extends Error {
  fieldErrors: AuthFieldErrors

  constructor(message: string, fieldErrors: AuthFieldErrors = {}) {
    super(message)
    this.name = 'AuthSubmissionError'
    this.fieldErrors = fieldErrors
  }
}

const t = (key: string) => i18n.t(key as never) as string

export const submitSignIn = async (values: SignInFormValues) => {
  await simulateDelay()

  const normalizedLogin = values.login.trim().toLowerCase()

  if (normalizedLogin === 'missing@anordonate.uz') {
    throw new AuthSubmissionError(t('auth.errors.signIn.dataInvalid'), {
      login: t('auth.errors.signIn.loginNotFound'),
    })
  }

  if (normalizedLogin === 'blocked@anordonate.uz') {
    throw new AuthSubmissionError(t('auth.errors.signIn.accountBlocked'))
  }

  if (normalizedLogin === 'wrong@anordonate.uz') {
    throw new AuthSubmissionError(t('auth.errors.signIn.wrongPassword'))
  }

  return {
    redirectTo: '/dashboard',
  }
}

export const submitSignUp = async (values: SignUpFormValues) => {
  await simulateDelay(1100)

  const normalizedEmail = values.email.trim().toLowerCase()
  const normalizedUsername = values.username.trim().toLowerCase()

  if (normalizedEmail === 'taken@anordonate.uz') {
    throw new AuthSubmissionError(t('auth.errors.signUp.retryFields'), {
      email: t('auth.errors.signUp.emailTaken'),
    })
  }

  if (normalizedUsername === 'taken_channel') {
    throw new AuthSubmissionError(t('auth.errors.signUp.retryFields'), {
      username: t('auth.errors.signUp.usernameTaken'),
    })
  }

  if (values.phone === '+998 (90) 111-11-11') {
    throw new AuthSubmissionError(t('auth.errors.signUp.retryFields'), {
      phone: t('auth.errors.signUp.phoneTaken'),
    })
  }

  return {
    redirectTo: '/otp-sms',
  }
}

export const requestPasswordReset = async (values: ResetPasswordFormValues) => {
  await simulateDelay()

  if (values.phone === '+998 (90) 000-00-00') {
    throw new AuthSubmissionError(t('auth.errors.reset.phoneNotFound'))
  }

  return {
    redirectTo: '/otp-sms',
  }
}

export const verifyOtpCode = async (values: OtpSmsFormValues) => {
  await simulateDelay(800)

  const otpCode = values.code.join('')

  if (otpCode !== '133742') {
    throw new AuthSubmissionError(t('auth.errors.otp.verifyFailed'), {
      code: t('auth.errors.otp.wrongCode'),
    })
  }

  return {
    redirectTo: '/sign-in',
  }
}

export const resendOtpCode = async () => {
  await simulateDelay(700)

  return {
    success: true,
  }
}
