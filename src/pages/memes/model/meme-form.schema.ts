import { z } from 'zod'

export const memeFormSchema = z.object({
  category: z.string().trim().min(1, 'Kategoriyani tanlang'),
  name: z.string().trim().min(2, "Nomi kamida 2 ta harf bo'lishi kerak"),
  priceUzs: z.number().min(1, "Narx 0 dan katta bo'lishi kerak"),
  volumePercent: z.number().min(0).max(100),
  removeGreenScreen: z.boolean(),
  videoFileName: z.string().optional(),
  selectedReadyMemeId: z.string().optional(),
})

export type MemeFormValues = z.infer<typeof memeFormSchema>
