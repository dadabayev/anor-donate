import cn from './input-field.module.css'

import classNames from 'classnames'
import { type InputHTMLAttributes, useId } from 'react'

export interface InputFieldProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'className'
> {
  label: string
  error?: string
  actionLabel?: string
  actionAriaLabel?: string
  onAction?: () => void
  className?: string
  inputClassName?: string
  actionDisabled?: boolean
}

export const InputField = ({
  label,
  error,
  actionLabel,
  actionAriaLabel,
  onAction,
  className,
  inputClassName,
  actionDisabled,
  id,
  ...inputProps
}: Readonly<InputFieldProps>) => {
  const generatedId = useId()
  const inputId = id ?? generatedId

  return (
    <label className={classNames(cn.field, className)} htmlFor={inputId}>
      <span className={cn.label}>{label}</span>
      <span className={cn.shell}>
        <input
          {...inputProps}
          id={inputId}
          className={classNames(cn.input, inputClassName)}
        />
        {actionLabel && onAction ? (
          <button
            type="button"
            className={cn.action}
            aria-label={actionAriaLabel ?? actionLabel}
            onClick={onAction}
            disabled={actionDisabled}
          >
            {actionLabel}
          </button>
        ) : null}
      </span>
      {error ? <span className={cn.error}>{error}</span> : null}
    </label>
  )
}
