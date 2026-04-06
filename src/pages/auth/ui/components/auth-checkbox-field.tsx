import cn from '../auth-page.module.css'

import classNames from 'classnames'
import type { InputHTMLAttributes, ReactNode } from 'react'

interface AuthCheckboxFieldProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'type' | 'className'
> {
  label: ReactNode
  error?: string
}

export const AuthCheckboxField = ({
  label,
  error,
  checked,
  id,
  ...inputProps
}: Readonly<AuthCheckboxFieldProps>) => {
  return (
    <div className={cn.checkboxGroup}>
      <label className={cn.checkbox} htmlFor={id}>
        <input
          {...inputProps}
          id={id}
          type="checkbox"
          checked={checked}
          className={cn.checkboxInput}
        />
        <span
          className={classNames(
            cn.checkboxBox,
            checked && cn.checkboxBoxChecked,
            error && cn.checkboxBoxError,
          )}
          aria-hidden="true"
        >
          ✓
        </span>
        <span className={cn.checkboxLabel}>{label}</span>
      </label>
      {error ? <span className={cn.checkboxError}>{error}</span> : null}
    </div>
  )
}
