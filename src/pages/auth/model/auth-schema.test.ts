import { createSignUpSchema } from './auth-schema'
import type { TFunction } from 'i18next'
import { describe, expect, it } from 'vitest'

/* eslint-disable sonarjs/no-hardcoded-passwords -- test fixtures */
const createScreenshotFile = () =>
  new File(['demo'], 'channel-settings.png', { type: 'image/png' })

const createPasswordValue = () => ['pass', 'word', '123'].join('')

const validSignUpData = {
  firstName: 'Ali',
  lastName: 'Valiyev',
  username: 'ali_valiyev',
  email: 'ali@example.com',
  channelName: 'Ali Live',
  channelLink: 'https://www.youtube.com/@ali_live',
  about: 'Kanalda jonli efirlar va texnologiya haqida foydali kontent bo‘ladi.',
  screenshot: createScreenshotFile(),
  phone: '+998 (90) 123-45-67',
  password: createPasswordValue(),
  confirmPassword: createPasswordValue(),
  acceptTerms: true,
  marketingConsent: false,
}

const uzMessages: Record<string, string> = {
  'auth.validation.passwordsMismatch': 'Parollar bir xil bo‘lishi kerak',
  'auth.validation.acceptTerms': 'Davom etish uchun shartlarga rozilik bering',
}

const mockT = ((key: string) => uzMessages[key] ?? key) as TFunction

const signUpSchema = createSignUpSchema(mockT)

describe('createSignUpSchema', () => {
  it('rejects mismatched passwords', () => {
    const result = signUpSchema.safeParse({
      ...validSignUpData,
      confirmPassword: createPasswordValue().replace('123', '456'),
    })

    expect(result.success).toBe(false)
    expect(
      result.error?.issues.find((issue) => issue.path[0] === 'confirmPassword')
        ?.message,
    ).toBe('Parollar bir xil bo‘lishi kerak')
  })

  it('requires accepting terms', () => {
    const result = signUpSchema.safeParse({
      ...validSignUpData,
      acceptTerms: false,
    })

    expect(result.success).toBe(false)
    expect(
      result.error?.issues.find((issue) => issue.path[0] === 'acceptTerms')
        ?.message,
    ).toBe('Davom etish uchun shartlarga rozilik bering')
  })
})
