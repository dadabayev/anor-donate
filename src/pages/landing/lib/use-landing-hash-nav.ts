import { type MouseEvent, useCallback } from 'react'

const LANDING_SCROLL_OFFSET = 128

export const smoothScrollToHash = (hash: string) => {
  const id = hash.replace('#', '')
  const section = document.getElementById(id)

  if (!section) {
    return
  }

  const top =
    section.getBoundingClientRect().top + window.scrollY - LANDING_SCROLL_OFFSET

  window.scrollTo({
    top: Math.max(0, top),
    behavior: 'smooth',
  })
}

export const useLandingHashNav = (onNavigate?: () => void) =>
  useCallback(
    (e: MouseEvent<HTMLAnchorElement>, hash: string) => {
      e.preventDefault()
      onNavigate?.()
      window.history.replaceState(null, '', hash)
      smoothScrollToHash(hash)
    },
    [onNavigate],
  )
