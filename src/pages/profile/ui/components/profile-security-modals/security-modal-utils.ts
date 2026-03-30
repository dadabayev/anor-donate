export const UZBEKISTAN_PHONE_REGEX = /^\+998 \(\d{2}\) \d{3}-\d{2}-\d{2}$/

export const OTP_LENGTH = 6

export const toTimer = (seconds: number) => {
  const safeSeconds = Math.max(0, seconds)
  const minutes = String(Math.floor(safeSeconds / 60)).padStart(2, '0')
  const leftSeconds = String(safeSeconds % 60).padStart(2, '0')
  return `${minutes}:${leftSeconds}`
}

export const isEmailValid = (value: string) => {
  const trimmed = value.trim()
  const atIndex = trimmed.indexOf('@')
  const dotIndex = trimmed.lastIndexOf('.')
  return atIndex > 0 && dotIndex > atIndex + 1 && dotIndex < trimmed.length - 1
}

export const getErrorMessage = (error: unknown, fallback: string) => {
  if (error instanceof Error && error.message) {
    return error.message
  }
  return fallback
}

export const buildEmptyOtpDigits = (): string[] =>
  Array.from({ length: OTP_LENGTH }, () => '')
