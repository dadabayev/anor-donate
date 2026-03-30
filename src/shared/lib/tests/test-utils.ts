import { TestProviders } from './test-providers'
import type { RenderHookOptions, RenderOptions } from '@testing-library/react'
import {
  render as testingLibraryRender,
  renderHook as testingLibraryRenderHook,
} from '@testing-library/react'
import type { ReactElement } from 'react'

export const render = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) => testingLibraryRender(ui, { wrapper: TestProviders, ...options })

export const renderHook = <Result, InitialProps>(
  cb: (props: InitialProps) => Result,
  options?: Omit<RenderHookOptions<InitialProps>, 'wrapper'>,
) => testingLibraryRenderHook(cb, { wrapper: TestProviders, ...options })
