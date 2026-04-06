/** Group digits with narrow no-break spaces (Uzbek locale style). */
export const formatUzsDigitsForInput = (digits: string): string => {
  if (!digits) {
    return ''
  }

  let formatted = ''
  let groupSize = 0

  for (let index = digits.length - 1; index >= 0; index -= 1) {
    formatted = `${digits[index]}${formatted}`
    groupSize += 1

    if (groupSize === 3 && index > 0) {
      formatted = `\u202f${formatted}`
      groupSize = 0
    }
  }

  return formatted
}

export const parseDigitsFromInput = (value: string): string =>
  value.replace(/\D/g, '').slice(0, 12)
