import { ASSETS } from '@shared/constants'

export const MEMES_PAGE_MODE_KEY = 'memes-page-mode'
export const READY_MEMES_MODE_KEY = 'ready-memes-mode'

export type MemesPageMode = 'default' | 'empty' | 'error'

export interface MemeItem {
  id: string
  category: string
  imageUrl: string
  name: string
  priceUzs: number
  volumePercent: number
}

export interface MemesDashboardData {
  memes: MemeItem[]
  streamLink: string
}

export interface MemeEditorData {
  categories: string[]
  meme: MemeItem | null
  readyMemes: MemeItem[]
}

export const MEMES_PAGE_TITLE = 'Memlar'
export const MEMES_LIST_SUBTITLE = 'Barcha memlar'
export const MEMES_EDITOR_SUBTITLE = "Mem qo'shish"
export const MEMES_SETTINGS_SUBTITLE = 'Donat sozlamalari:'
export const MEMES_CREATE_ACTION = "Memni qo'shish"
export const MEMES_BACK_ACTION = 'Orqaga qaytarish'
export const MEMES_SAVE_ACTION = "O'zgarishlarni Saqlash"
export const MEMES_PICK_FILE_ACTION = 'Faylni tanlash'
export const MEMES_EMPTY_TITLE = 'Memlar topilmadi'
export const MEMES_EMPTY_TEXT = "Hozircha memlar qo'shilmagan."
export const MEMES_EMPTY_ACTION = "Mem qo'shish"
export const MEMES_ERROR_TITLE = 'Memlar yuklanmadi'
export const MEMES_ERROR_TEXT = "Qaytadan urinib ko'ring."
export const MEMES_RETRY_ACTION = 'Qayta yuklash'
export const MEMES_COPY_ACTION = 'Strim havolasini nusxalash'
export const MEMES_SELECTION_TITLE = 'Tanlang'
export const MEMES_MODAL_SAVE = 'Saqlash'

export const MEMES_DELETE_MODAL_TITLE = 'Ogohlantirish'
export const MEMES_DELETE_MODAL_BODY =
  "Ushbu memni o'chirsangiz, u strimingizda va ro'yxatingizdan butunlay yo'qoladi. Davom etishni xohlaysizmi?"
export const MEMES_DELETE_CANCEL = 'Bekor qilish'
export const MEMES_DELETE_CONFIRM = "O'chirish"
export const MEMES_DELETE_PENDING = "O'chirilmoqda..."
export const MEMES_DELETE_SUCCESS_TOAST = "Mem muvaffaqiyatli o'chirildi."
export const MEMES_DELETE_ERROR =
  "Memni o'chirishda xatolik yuz berdi. Internet aloqangizni tekshirib, qayta urinib ko'ring."

export const MEME_CATEGORIES = ['Game', 'Reaction', 'Sport', 'Other']
export const MEME_DEFAULT_STREAM_LINK = 'https://anordonate.uz/examplelink'

const BASE_MEME: Omit<MemeItem, 'id' | 'name' | 'priceUzs'> = {
  category: 'Game',
  imageUrl: ASSETS.MEME_SAMPLE,
  volumePercent: 25,
}

export const DEFAULT_MEMES: MemeItem[] = [
  { id: 'meme-1', ...BASE_MEME, name: 'Cristiano 1', priceUzs: 25_000 },
  { id: 'meme-2', ...BASE_MEME, name: 'Cristiano 2', priceUzs: 25_000 },
  { id: 'meme-3', ...BASE_MEME, name: 'Cristiano 3', priceUzs: 25_000 },
  { id: 'meme-4', ...BASE_MEME, name: 'Cristiano 4', priceUzs: 25_000 },
  { id: 'meme-5', ...BASE_MEME, name: 'Cristiano 5', priceUzs: 25_000 },
  { id: 'meme-6', ...BASE_MEME, name: 'Cristiano 6', priceUzs: 25_000 },
]

export const DEFAULT_READY_MEMES: MemeItem[] = [
  { id: 'ready-1', ...BASE_MEME, name: 'Cat', priceUzs: 25_000 },
  { id: 'ready-2', ...BASE_MEME, name: 'Funny', priceUzs: 30_000 },
  { id: 'ready-3', ...BASE_MEME, name: 'Wink', priceUzs: 20_000 },
  { id: 'ready-4', ...BASE_MEME, name: 'Rage', priceUzs: 45_000 },
  { id: 'ready-5', ...BASE_MEME, name: 'Dance', priceUzs: 35_000 },
  { id: 'ready-6', ...BASE_MEME, name: 'Wow', priceUzs: 22_000 },
]

const cloneMeme = (meme: MemeItem): MemeItem => ({ ...meme })

export const createMemesDashboard = (): MemesDashboardData => ({
  memes: DEFAULT_MEMES.map(cloneMeme),
  streamLink: MEME_DEFAULT_STREAM_LINK,
})

export const createMemeEditorData = (memeId?: string): MemeEditorData => {
  const memes = DEFAULT_MEMES.map(cloneMeme)
  const meme = memeId
    ? (memes.find((item) => item.id === memeId) ?? null)
    : null

  return {
    categories: [...MEME_CATEGORIES],
    meme,
    readyMemes: DEFAULT_READY_MEMES.map(cloneMeme),
  }
}

export const readMemesPageMode = (key: string): MemesPageMode => {
  if (typeof window === 'undefined') {
    return 'default'
  }

  const mode = window.localStorage.getItem(key)
  if (mode === 'empty' || mode === 'error') {
    return mode
  }

  return 'default'
}
