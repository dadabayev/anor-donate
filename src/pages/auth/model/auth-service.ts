import type {
  OtpSmsFormValues,
  ResetPasswordFormValues,
  SignInFormValues,
  SignUpFormValues,
} from './auth-schema'
import { $api, performLogout } from '@shared/api'
import { API_ENDPOINTS } from '@shared/constants'
import type { AuthRole } from '@shared/lib'
import type { AxiosError } from 'axios'

type AuthFieldErrors = Record<string, string>

export class AuthSubmissionError extends Error {
  fieldErrors: AuthFieldErrors

  constructor(message: string, fieldErrors: AuthFieldErrors = {}) {
    super(message)
    this.name = 'AuthSubmissionError'
    this.fieldErrors = fieldErrors
  }
}

interface ApiEnvelope<T> {
  data: T
  message: string
  success: boolean
}

export interface TokenDto {
  userId: number
  username: string
  role: AuthRole
  accessToken: string
  refreshToken: string
}

interface RegisterRequestBody {
  username: string
  password: string
  displayName: string
  firstName: string
  lastName: string
  email: string
  phoneE164: string
  telegramId: string
  channelName: string
  channelUrl: string
  channelDescription: string
  socialLinksJson: string
}

const toE164FromFormattedUzPhone = (phone: string) => {
  const digits = phone.replace(/\D/g, '')
  if (digits.startsWith('998')) {
    return `+${digits}`
  }

  return `+998${digits}`
}

const sanitizeMessage = (fallback: string, message?: string) =>
  typeof message === 'string' && message.trim() ? message : fallback

const getSocialTypeFromUrl = (url: string) => {
  const lowercase = url.toLowerCase()
  if (lowercase.includes('instagram.com')) return 'instagram'
  if (lowercase.includes('t.me') || lowercase.includes('telegram'))
    return 'telegram'
  if (lowercase.includes('youtube.com') || lowercase.includes('youtu.be'))
    return 'youtube'
  if (lowercase.includes('facebook.com')) return 'facebook'
  if (lowercase.includes('tiktok.com')) return 'tiktok'
  return 'website'
}

const buildSocialLinksJson = (url: string) => {
  const type = getSocialTypeFromUrl(url)
  return JSON.stringify({ [type]: url })
}

const asApiMessage = (error: unknown, fallbackMessage: string) => {
  const axiosError = error as AxiosError<ApiEnvelope<null>>
  return sanitizeMessage(fallbackMessage, axiosError.response?.data?.message)
}

const ensureTokenDto = (data: TokenDto | null | undefined, message: string) => {
  if (
    !data ||
    typeof data.userId !== 'number' ||
    typeof data.username !== 'string' ||
    (data.role !== 'ADMIN' && data.role !== 'USER') ||
    !data.accessToken ||
    !data.refreshToken
  ) {
    throw new AuthSubmissionError(message)
  }

  return data
}

const mapSignUpValuesToPayload = (
  values: SignUpFormValues,
): RegisterRequestBody => ({
  username: values.username.trim(),
  password: values.password,
  displayName: `${values.firstName.trim()} ${values.lastName.trim()}`.trim(),
  firstName: values.firstName.trim(),
  lastName: values.lastName.trim(),
  email: values.email.trim().toLowerCase(),
  phoneE164: toE164FromFormattedUzPhone(values.phone),
  telegramId: values.username.trim(),
  channelName: values.channelName.trim(),
  channelUrl: values.channelLink.trim(),
  channelDescription: values.about.trim(),
  socialLinksJson: buildSocialLinksJson(values.channelLink.trim()),
})

export const submitSignIn = async (values: SignInFormValues) => {
  try {
    const response = await $api.post<ApiEnvelope<TokenDto>>(
      API_ENDPOINTS.auth.login,
      {
        email: values.login.trim().toLowerCase(),
        password: values.password,
      },
      {
        skipAuthRefresh: true,
      },
    )

    if (!response.data.success) {
      throw new AuthSubmissionError(
        sanitizeMessage('Login failed', response.data.message),
      )
    }

    return {
      session: ensureTokenDto(response.data.data, response.data.message),
      message: response.data.message,
    }
  } catch (error) {
    if (error instanceof AuthSubmissionError) {
      throw error
    }

    throw new AuthSubmissionError(asApiMessage(error, 'Login failed'))
  }
}

export const submitSignUp = async (values: SignUpFormValues) => {
  try {
    const response = await $api.post<ApiEnvelope<null>>(
      API_ENDPOINTS.auth.register,
      mapSignUpValuesToPayload(values),
      {
        skipAuthRefresh: true,
      },
    )

    if (!response.data.success) {
      throw new AuthSubmissionError(
        sanitizeMessage('Sign up failed', response.data.message),
      )
    }

    return {
      redirectTo: '/otp-sms',
      message: response.data.message,
      phoneE164: toE164FromFormattedUzPhone(values.phone),
    }
  } catch (error) {
    if (error instanceof AuthSubmissionError) {
      throw error
    }

    throw new AuthSubmissionError(asApiMessage(error, 'Sign up failed'))
  }
}

export const requestPasswordReset = async (values: ResetPasswordFormValues) => {
  return resendVerificationCode({
    phoneE164: toE164FromFormattedUzPhone(values.phone),
  }).then((response) => ({
    redirectTo: '/otp-sms',
    message: response.message,
    phoneE164: response.phoneE164,
  }))
}

export const verifyOtpCode = async (
  values: OtpSmsFormValues,
  phoneE164: string,
) => {
  return verifyRegistrationOtp({
    phoneE164,
    code: values.code.join(''),
  })
}

export interface VerifyRegistrationPayload {
  phoneE164: string
  code: string
}

export const verifyRegistrationOtp = async (
  payload: VerifyRegistrationPayload,
) => {
  try {
    const response = await $api.post<ApiEnvelope<TokenDto>>(
      API_ENDPOINTS.auth.verify,
      payload,
      {
        skipAuthRefresh: true,
      },
    )

    if (!response.data.success) {
      throw new AuthSubmissionError(
        sanitizeMessage('OTP verification failed', response.data.message),
        {
          code: sanitizeMessage(
            'OTP verification failed',
            response.data.message,
          ),
        },
      )
    }

    return {
      session: ensureTokenDto(response.data.data, response.data.message),
      message: response.data.message,
    }
  } catch (error) {
    if (error instanceof AuthSubmissionError) {
      throw error
    }

    const message = asApiMessage(error, 'OTP verification failed')
    throw new AuthSubmissionError(message, { code: message })
  }
}

export interface ResendVerificationPayload {
  phoneE164: string
}

export const resendVerificationCode = async (
  payload: ResendVerificationPayload,
) => {
  try {
    const response = await $api.post<ApiEnvelope<null>>(
      API_ENDPOINTS.auth.resend,
      payload,
      {
        skipAuthRefresh: true,
      },
    )

    if (!response.data.success) {
      throw new AuthSubmissionError(
        sanitizeMessage('Failed to resend code', response.data.message),
      )
    }

    return {
      success: true,
      message: response.data.message,
      phoneE164: payload.phoneE164,
    }
  } catch (error) {
    if (error instanceof AuthSubmissionError) {
      throw error
    }

    throw new AuthSubmissionError(asApiMessage(error, 'Failed to resend code'))
  }
}

export const resendOtpCode = async (phoneE164: string) => {
  return resendVerificationCode({ phoneE164 })
}

export const fetchCurrentUser = async () => {
  try {
    const response = await $api.get<
      ApiEnvelope<{
        status: number
        id: number
        username: string
        role: AuthRole
      }>
    >(API_ENDPOINTS.auth.me)

    if (!response.data.success || !response.data.data) {
      throw new AuthSubmissionError(
        sanitizeMessage('Failed to fetch current user', response.data.message),
      )
    }

    return response.data.data
  } catch (error) {
    if (error instanceof AuthSubmissionError) {
      throw error
    }

    throw new AuthSubmissionError(
      asApiMessage(error, 'Failed to fetch current user'),
    )
  }
}

export const logout = async () => {
  await performLogout()
}
