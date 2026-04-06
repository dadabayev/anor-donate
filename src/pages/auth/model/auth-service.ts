import type {
  OtpSmsFormValues,
  ResetPasswordFormValues,
  SignInFormValues,
  SignUpFormValues,
} from './auth-schema'

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

export const submitSignIn = async (values: SignInFormValues) => {
  await simulateDelay()

  const normalizedLogin = values.login.trim().toLowerCase()

  if (normalizedLogin === 'missing@anordonate.uz') {
    throw new AuthSubmissionError('Kiritilgan ma’lumot tekshirilmadi.', {
      login: 'Bu login yoki pochta topilmadi',
    })
  }

  if (normalizedLogin === 'blocked@anordonate.uz') {
    throw new AuthSubmissionError(
      'Bu akkaunt vaqtincha bloklangan. Qo‘llab-quvvatlash xizmati bilan bog‘laning.',
    )
  }

  if (normalizedLogin === 'wrong@anordonate.uz') {
    throw new AuthSubmissionError('Parol noto‘g‘ri. Qaytadan urinib ko‘ring.')
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
    throw new AuthSubmissionError('Ayrim maydonlarni qayta tekshiring.', {
      email: 'Bu elektron pochta allaqachon ro‘yxatdan o‘tgan',
    })
  }

  if (normalizedUsername === 'taken_channel') {
    throw new AuthSubmissionError('Ayrim maydonlarni qayta tekshiring.', {
      username: 'Bu username band',
    })
  }

  if (values.phone === '+998 (90) 111-11-11') {
    throw new AuthSubmissionError('Ayrim maydonlarni qayta tekshiring.', {
      phone: 'Bu telefon raqami allaqachon ishlatilgan',
    })
  }

  return {
    redirectTo: '/otp-sms',
  }
}

export const requestPasswordReset = async (values: ResetPasswordFormValues) => {
  await simulateDelay()

  if (values.phone === '+998 (90) 000-00-00') {
    throw new AuthSubmissionError(
      'Bu telefon raqami bilan bog‘langan akkaunt topilmadi.',
    )
  }

  return {
    redirectTo: '/otp-sms',
  }
}

export const verifyOtpCode = async (values: OtpSmsFormValues) => {
  await simulateDelay(800)

  const otpCode = values.code.join('')

  if (otpCode !== '133742') {
    throw new AuthSubmissionError('Tasdiqlash amalga oshmadi.', {
      code: 'Kod noto‘g‘ri. Qaytadan urinib ko‘ring',
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
