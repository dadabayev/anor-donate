import cn from '../auth-page.module.css'

import { Loader } from '@mantine/core'
import type { ButtonHTMLAttributes, ReactNode } from 'react'

interface AuthSubmitButtonProps extends Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'className'
> {
  loading?: boolean
  children: ReactNode
}

export const AuthSubmitButton = ({
  loading,
  children,
  disabled,
  ...buttonProps
}: Readonly<AuthSubmitButtonProps>) => {
  return (
    <button
      {...buttonProps}
      type={buttonProps.type ?? 'submit'}
      className={cn.submitButton}
      disabled={disabled || loading}
    >
      {loading ? (
        <span className={cn.buttonLoader} aria-hidden="true">
          <Loader color="white" size={18} />
        </span>
      ) : null}
      <span>{children}</span>
    </button>
  )
}
