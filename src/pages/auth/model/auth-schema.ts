import { z } from 'zod'

export const UZBEKISTAN_PHONE_REGEX = /^\+998 \(\d{2}\) \d{3}-\d{2}-\d{2}$/
export const EMPTY_OTP_CODE = ['', '', '', '', '', ''] as const

const requiredText = (message: string) => z.string().trim().min(1, { message })

const passwordField = requiredText('Parolni kiriting').refine(
  (value) => value.length >= 8,
  {
    message: 'Parol kamida 8 ta belgidan iborat bo‘lsin',
  },
)

const emailField = requiredText('Elektron pochtani kiriting').refine(
  (value) => z.email().safeParse(value).success,
  {
    message: 'Yaroqli elektron pochta kiriting',
  },
)

const channelLinkField = requiredText('Kanal havolasini kiriting').refine(
  (value) => {
    try {
      const url = new URL(value)

      return ['http:', 'https:'].includes(url.protocol)
    } catch {
      return false
    }
  },
  {
    message: 'Yaroqli kanal havolasini kiriting',
  },
)

const phoneField = requiredText('Telefon raqamini kiriting').refine(
  (value) => UZBEKISTAN_PHONE_REGEX.test(value),
  {
    message: "Telefon raqami +998 (00) 000-00-00 formatida bo'lishi kerak",
  },
)

const screenshotField = z
  .custom<File | null>((value) => value === null || value instanceof File, {
    message: 'Screenshot yuklash shart',
  })
  .refine((value) => value instanceof File, {
    message: 'Screenshot yuklash shart',
  })

export const signInSchema = z.object({
  login: requiredText('Login yoki pochtani kiriting'),
  password: passwordField,
  rememberMe: z.boolean(),
})

export const signUpSchema = z
  .object({
    firstName: requiredText('Ismni kiriting'),
    lastName: requiredText('Familyani kiriting'),
    username: requiredText('Usernameni kiriting').refine(
      (value) => /^[a-zA-Z0-9_.]+$/.test(value),
      {
        message:
          'Username faqat harf, raqam, nuqta va pastki chiziqdan iborat bo‘lishi kerak',
      },
    ),
    email: emailField,
    channelName: requiredText('Kanal nomini kiriting'),
    channelLink: channelLinkField,
    about: requiredText('Kanal haqida qisqacha yozing')
      .refine((value) => value.length >= 20, {
        message: 'Kanal tavsifi kamida 20 ta belgidan iborat bo‘lsin',
      })
      .refine((value) => value.length <= 500, {
        message: 'Kanal tavsifi 500 ta belgidan oshmasin',
      }),
    screenshot: screenshotField,
    phone: phoneField,
    password: passwordField,
    confirmPassword: requiredText('Parolni takrorlang'),
    acceptTerms: z.boolean().refine((value) => value, {
      message: 'Davom etish uchun shartlarga rozilik bering',
    }),
    marketingConsent: z.boolean(),
  })
  .superRefine((value, context) => {
    if (value.password !== value.confirmPassword) {
      context.addIssue({
        code: 'custom',
        message: 'Parollar bir xil bo‘lishi kerak',
        path: ['confirmPassword'],
      })
    }
  })

export const resetPasswordSchema = z.object({
  phone: phoneField,
})

export const otpSmsSchema = z.object({
  code: z
    .array(z.string().regex(/^\d?$/, { message: 'Faqat raqam kiriting' }))
    .length(6)
    .refine((digits) => digits.every((digit) => digit.length === 1), {
      message: '6 xonali kodni kiriting',
    }),
})

export type SignInFormValues = z.infer<typeof signInSchema>
export type SignUpFormInputValues = z.input<typeof signUpSchema>
export type SignUpFormValues = z.infer<typeof signUpSchema>
export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>
export type OtpSmsFormValues = z.infer<typeof otpSmsSchema>
