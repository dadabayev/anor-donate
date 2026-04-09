import type { TFunction } from 'i18next'
import { z } from 'zod'

export const UZBEKISTAN_PHONE_REGEX = /^\+998 \(\d{2}\) \d{3}-\d{2}-\d{2}$/
export const EMPTY_OTP_CODE = ['', '', '', '', '', ''] as const

export const createSignInSchema = (t: TFunction) => {
  const passwordField = z
    .string()
    .trim()
    .min(1, { message: t('auth.validation.passwordRequired') })
    .refine((value) => value.length >= 8, {
      message: t('auth.validation.passwordMinLength'),
    })

  return z.object({
    login: z
      .string()
      .trim()
      .min(1, { message: t('auth.validation.loginRequired') }),
    password: passwordField,
    rememberMe: z.boolean(),
  })
}

export const createSignUpSchema = (t: TFunction) => {
  const passwordField = z
    .string()
    .trim()
    .min(1, { message: t('auth.validation.passwordRequired') })
    .refine((value) => value.length >= 8, {
      message: t('auth.validation.passwordMinLength'),
    })

  const emailField = z
    .string()
    .trim()
    .min(1, { message: t('auth.validation.emailRequired') })
    .refine((value) => z.email().safeParse(value).success, {
      message: t('auth.validation.emailInvalid'),
    })

  const channelLinkField = z
    .string()
    .trim()
    .min(1, { message: t('auth.validation.channelLinkRequired') })
    .refine(
      (value) => {
        try {
          const url = new URL(value)
          return ['http:', 'https:'].includes(url.protocol)
        } catch {
          return false
        }
      },
      { message: t('auth.validation.channelLinkInvalid') },
    )

  const phoneField = z
    .string()
    .trim()
    .min(1, { message: t('auth.validation.phoneRequired') })
    .refine((value) => UZBEKISTAN_PHONE_REGEX.test(value), {
      message: t('auth.validation.phoneInvalid'),
    })

  const screenshotField = z
    .custom<File | null>((value) => value === null || value instanceof File, {
      message: t('auth.validation.screenshotRequired'),
    })
    .refine((value) => value instanceof File, {
      message: t('auth.validation.screenshotRequired'),
    })

  return z
    .object({
      firstName: z
        .string()
        .trim()
        .min(1, { message: t('auth.validation.firstNameRequired') }),
      lastName: z
        .string()
        .trim()
        .min(1, { message: t('auth.validation.lastNameRequired') }),
      username: z
        .string()
        .trim()
        .min(1, { message: t('auth.validation.usernameRequired') })
        .refine((value) => /^[a-zA-Z0-9_.]+$/.test(value), {
          message: t('auth.validation.usernameFormat'),
        }),
      email: emailField,
      channelName: z
        .string()
        .trim()
        .min(1, { message: t('auth.validation.channelNameRequired') }),
      channelLink: channelLinkField,
      about: z
        .string()
        .trim()
        .min(1, { message: t('auth.validation.aboutRequired') })
        .refine((value) => value.length >= 20, {
          message: t('auth.validation.aboutMin'),
        })
        .refine((value) => value.length <= 500, {
          message: t('auth.validation.aboutMax'),
        }),
      screenshot: screenshotField,
      phone: phoneField,
      password: passwordField,
      confirmPassword: z
        .string()
        .trim()
        .min(1, { message: t('auth.validation.confirmPasswordRequired') }),
      acceptTerms: z.boolean().refine((value) => value, {
        message: t('auth.validation.acceptTerms'),
      }),
      marketingConsent: z.boolean(),
    })
    .superRefine((value, context) => {
      if (value.password !== value.confirmPassword) {
        context.addIssue({
          code: 'custom',
          message: t('auth.validation.passwordsMismatch'),
          path: ['confirmPassword'],
        })
      }
    })
}

export const createResetPasswordSchema = (t: TFunction) => {
  const phoneField = z
    .string()
    .trim()
    .min(1, { message: t('auth.validation.phoneRequired') })
    .refine((value) => UZBEKISTAN_PHONE_REGEX.test(value), {
      message: t('auth.validation.phoneInvalid'),
    })

  return z.object({
    phone: phoneField,
  })
}

export const createOtpSmsSchema = (t: TFunction) =>
  z.object({
    code: z
      .array(
        z.string().regex(/^\d?$/, { message: t('auth.validation.otpDigit') }),
      )
      .length(6)
      .refine((digits) => digits.every((digit) => digit.length === 1), {
        message: t('auth.validation.otpComplete'),
      }),
  })

export type SignInFormValues = z.infer<ReturnType<typeof createSignInSchema>>
export type SignUpFormInputValues = z.input<
  ReturnType<typeof createSignUpSchema>
>
export type SignUpFormValues = z.infer<ReturnType<typeof createSignUpSchema>>
export type ResetPasswordFormValues = z.infer<
  ReturnType<typeof createResetPasswordSchema>
>
export type OtpSmsFormValues = z.infer<ReturnType<typeof createOtpSmsSchema>>
