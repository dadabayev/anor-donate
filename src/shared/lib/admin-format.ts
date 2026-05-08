/** Формат даты/времени как в таблицах админки: YYYY-MM-DD HH:mm */
export function formatAdminDateTime(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) {
    return iso
  }
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`
}

export function formatDurationMmSs(totalSec: number): string {
  const safe = Math.max(0, Math.floor(totalSec))
  const m = Math.floor(safe / 60)
  const s = safe % 60
  return `${m}:${String(s).padStart(2, '0')}`
}

/** Разбор полей вида m:ss или h:mm:ss в секунды */
export function parseDurationToSeconds(input: string): number {
  const parts = input
    .trim()
    .split(':')
    .map((p) => Number.parseInt(p, 10))
  if (parts.length < 2 || parts.some((n) => Number.isNaN(n))) {
    return 0
  }
  if (parts.length === 2) {
    return parts[0] * 60 + parts[1]
  }
  return parts[0] * 3600 + parts[1] * 60 + parts[2]
}
