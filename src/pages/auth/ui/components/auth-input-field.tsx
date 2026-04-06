import cn from '../auth-page.module.css'

import classNames from 'classnames'
import type { InputHTMLAttributes, ReactNode } from 'react'

interface AuthInputFieldProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'className'
> {
  label: string
  error?: string
  footer?: ReactNode
  className?: string
}

export const AuthInputField = ({
  label,
  error,
  footer,
  className,
  id,
  ...inputProps
}: Readonly<AuthInputFieldProps>) => {
  return (
    <label className={classNames(cn.field, className)} htmlFor={id}>
      <span className={cn.label}>{label}</span>
      <span className={classNames(cn.control, error && cn.controlError)}>
        <input {...inputProps} id={id} className={cn.input} />
      </span>
      {error || footer ? (
        <span className={cn.footerRow}>
          {error ? (
            <span className={cn.error}>{error}</span>
          ) : (
            <span className={cn.helperSpacer} aria-hidden="true" />
          )}
          {footer ? <span className={cn.footerMeta}>{footer}</span> : null}
        </span>
      ) : null}
    </label>
  )
}
