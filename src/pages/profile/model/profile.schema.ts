import { z } from 'zod'

const uzbekistanPhoneRegex = /^\+998 \(\d{2}\) \d{3}-\d{2}-\d{2}$/

export const profileSchema = z.object({
  firstName: z.string().trim().min(1, { message: 'Ism kiritish shart' }),
  lastName: z.string().trim().min(1, { message: 'Familya kiritish shart' }),
  pnfl: z
    .string()
    .trim()
    .regex(/^\d{14}$/, {
      message: 'JSHSHIR 14 ta raqamdan iborat bo‘lishi kerak',
    }),
  phone: z.string().trim().regex(uzbekistanPhoneRegex, {
    message: "Telefon raqami +998 (00) 000-00-00 formatida bo'lishi kerak",
  }),
  email: z.email({ message: 'Yaroqli e-mail kiriting' }),
  password: z
    .string()
    .trim()
    .min(8, { message: 'Parol kamida 8 ta belgidan iborat bo‘lsin' }),
  username: z.string().trim().min(1, { message: 'Username kiritish shart' }),
  channelName: z
    .string()
    .trim()
    .min(1, { message: 'Kanal nomi kiritish shart' }),
  channelLink: z
    .string()
    .trim()
    .min(1, { message: 'Asosiy kanal havolasi kiritish shart' }),
  channelAbout: z.string().trim(),
})
