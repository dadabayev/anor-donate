import type { TFunction } from 'i18next'
import { z } from 'zod'

/** Platform limits in UZS (whole units). */
export const MIN_DONATION_UZS = 5_000
export const MAX_DONATION_UZS = 99_000_000

const digitsOnly = (s: string) => s.replace(/\D/g, '')

export const createDonationFormSchema = (t: TFunction, localeTag: string) =>
  z
    .object({
      amountDisplay: z.string(),
    })
    .superRefine((data, ctx) => {
      const raw = digitsOnly(data.amountDisplay)
      if (!raw) {
        ctx.addIssue({
          code: 'custom',
          path: ['amountDisplay'],
          message: t('landing.donation.validation.required'),
        })
        return
      }
      const n = Number(raw)
      const currency = t('landing.donation.currencySuffix')
      if (!Number.isFinite(n) || n < MIN_DONATION_UZS) {
        ctx.addIssue({
          code: 'custom',
          path: ['amountDisplay'],
          message: t('landing.donation.validation.min', {
            amount: MIN_DONATION_UZS.toLocaleString(localeTag),
            currency,
          }),
        })
        return
      }
      if (n > MAX_DONATION_UZS) {
        ctx.addIssue({
          code: 'custom',
          path: ['amountDisplay'],
          message: t('landing.donation.validation.max', {
            amount: MAX_DONATION_UZS.toLocaleString(localeTag),
            currency,
          }),
        })
      }
    })

export type DonationFormValues = z.infer<
  ReturnType<typeof createDonationFormSchema>
>
