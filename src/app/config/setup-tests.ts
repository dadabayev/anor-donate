import '@testing-library/jest-dom/vitest'

import { vi } from 'vitest'

const { getComputedStyle } = globalThis
globalThis.getComputedStyle = (elt) => getComputedStyle(elt)
globalThis.HTMLElement.prototype.scrollIntoView = () => {
  // scrollIntoView
}

Object.defineProperty(globalThis, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: true,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

Object.defineProperty(navigator, 'serviceWorker', {
  writable: true,
  value: {
    getRegistrations: vi.fn().mockReturnValue([]),
  },
})

class ResizeObserver {
  observe() {
    // observe
  }
  unobserve() {
    // unobserve
  }
  disconnect() {
    // disconnect
  }
}

globalThis.ResizeObserver = ResizeObserver
