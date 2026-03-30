import { render, renderHook } from './test-utils'
import { useState } from 'react'
import { describe, expect, it } from 'vitest'

describe('test-utils', () => {
  describe('render', () => {
    it('should render component with TestProviders wrapper', () => {
      const { getByText } = render(<div>Test Component</div>)

      expect(getByText('Test Component')).toBeInTheDocument()
    })

    it('should pass additional options to testing library render', () => {
      const { container } = render(<div>Test</div>, {
        container: document.body,
      })

      expect(container).toBe(document.body)
    })
  })

  describe('renderHook', () => {
    it('should render hook with TestProviders wrapper', () => {
      const { result } = renderHook(() => useState(0))

      expect(result.current[0]).toBe(0)
    })

    it('should render hook with initial props', () => {
      const { result } = renderHook(
        (initialValue: number) => useState(initialValue),
        { initialProps: 42 },
      )

      expect(result.current[0]).toBe(42)
    })
  })
})
