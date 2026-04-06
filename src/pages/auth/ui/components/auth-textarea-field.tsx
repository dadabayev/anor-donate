import cn from '../auth-page.module.css'

import classNames from 'classnames'
import type { ReactNode, TextareaHTMLAttributes } from 'react'

interface AuthTextareaFieldProps extends Omit<
  TextareaHTMLAttributes<HTMLTextAreaElement>,
  'className'
> {
  label: string
  error?: string
  footer?: ReactNode
  className?: string
}

export const AuthTextareaField = ({
  label,
  error,
  footer,
  className,
  id,
  rows = 6,
  ...textareaProps
}: Readonly<AuthTextareaFieldProps>) => {
  return (
    <label className={classNames(cn.field, className)} htmlFor={id}>
      <span className={cn.label}>{label}</span>
      <span className={classNames(cn.control, error && cn.controlError)}>
        <textarea
          {...textareaProps}
          id={id}
          rows={rows}
          className={cn.textarea}
        />
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
