import { z } from 'zod'

export const socialLinkSchema = z.object({
  link: z
    .string()
    .trim()
    .min(1, { message: 'Link is required' })
    .refine(
      (value) => {
        try {
          const parsed = new URL(value)
          return parsed.protocol === 'http:' || parsed.protocol === 'https:'
        } catch {
          return false
        }
      },
      { message: 'Link must be a valid URL' },
    ),
})

export type SocialLinkFormValues = z.infer<typeof socialLinkSchema>
