import { z } from 'zod'

/** Platform limits in UZS (whole units). */
export const MIN_DONATION_UZS = 5_000
export const MAX_DONATION_UZS = 99_000_000

const digitsOnly = (s: string) => s.replace(/\D/g, '')

export const donationFormSchema = z
  .object({
    amountDisplay: z.string(),
  })
  .superRefine((data, ctx) => {
    const raw = digitsOnly(data.amountDisplay)
    if (!raw) {
      ctx.addIssue({
        code: 'custom',
        path: ['amountDisplay'],
        message: 'Summani kiriting',
      })
      return
    }
    const n = Number(raw)
    if (!Number.isFinite(n) || n < MIN_DONATION_UZS) {
      ctx.addIssue({
        code: 'custom',
        path: ['amountDisplay'],
        message: `Minimal summa ${MIN_DONATION_UZS.toLocaleString('uz-UZ')} so‘m`,
      })
      return
    }
    if (n > MAX_DONATION_UZS) {
      ctx.addIssue({
        code: 'custom',
        path: ['amountDisplay'],
        message: `Maksimal summa ${MAX_DONATION_UZS.toLocaleString('uz-UZ')} so‘m`,
      })
    }
  })

export type DonationFormValues = z.infer<typeof donationFormSchema>
