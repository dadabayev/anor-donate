const COUNTRY_CODE = '998'
const MAX_LOCAL_DIGITS = 9

export const UZBEKISTAN_PHONE_PLACEHOLDER = '+998 (__) ___-__-__'

export const formatUzbekistanPhoneInput = (value: string) => {
  const digitsOnly = value.replace(/\D/g, '')
  const localDigits = (
    digitsOnly.startsWith(COUNTRY_CODE)
      ? digitsOnly.slice(COUNTRY_CODE.length)
      : digitsOnly
  ).slice(0, MAX_LOCAL_DIGITS)

  if (!localDigits.length) {
    return '+998'
  }

  const areaCode = localDigits.slice(0, 2)
  const firstChunk = localDigits.slice(2, 5)
  const secondChunk = localDigits.slice(5, 7)
  const thirdChunk = localDigits.slice(7, 9)

  let formatted = `+998 (${areaCode}`

  if (localDigits.length >= 2) {
    formatted += ')'
  }

  if (firstChunk) {
    formatted += ` ${firstChunk}`
  }

  if (secondChunk) {
    formatted += `-${secondChunk}`
  }

  if (thirdChunk) {
    formatted += `-${thirdChunk}`
  }

  return formatted
}
