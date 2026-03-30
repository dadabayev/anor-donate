export interface DonationHistoryRow {
  id: string
  number: number
  name: string
  paymentAmount: string
  commission: string
  paymentTime: string
}

export const DONATIONS_MODE_KEY = 'donations-page-mode'

type DonationsMode = 'default' | 'empty' | 'error'

export const DONATIONS_PAGE_TITLE = 'Donatlar Tarixi'

export const DONATION_HISTORY_EMPTY_TEXT =
  'Hozircha donatlar tarixi mavjud emas'

export const DONATION_HISTORY_ERROR_TITLE = "Ma'lumotlarni yuklab bo'lmadi"

export const DONATION_HISTORY_ERROR_TEXT =
  "Donatlar tarixini olishda xatolik yuz berdi. Qayta urinib ko'ring."

export const DONATION_HISTORY_EMPTY_TITLE = 'Donatlar tarixi topilmadi'

export const DONATION_HISTORY_EMPTY_HINT =
  "Yangi donatlar kelgandan keyin ular shu yerda ko'rinadi."

export const DONATION_HISTORY_RETRY_LABEL = 'Qayta urinish'

const DEFAULT_ROWS: DonationHistoryRow[] = Array.from(
  { length: 10 },
  (_, index) => ({
    id: String(index + 1),
    number: index + 1,
    name: index === 0 ? 'Anonim' : 'Andy Smith',
    paymentAmount: "25 000 so'm",
    commission: "25 000 so'm",
    paymentTime: '12.03.2026 08:10',
  }),
)

const readMode = (): DonationsMode => {
  if (typeof window === 'undefined') {
    return 'default'
  }

  const mode = window.localStorage.getItem(DONATIONS_MODE_KEY)

  if (mode === 'empty' || mode === 'error') {
    return mode
  }

  return 'default'
}

export const readDonationHistory = (): DonationHistoryRow[] => {
  const mode = readMode()

  if (mode === 'error') {
    throw new Error('Unable to load donation history')
  }

  if (mode === 'empty') {
    return []
  }

  return DEFAULT_ROWS
}
