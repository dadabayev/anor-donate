import cn from '../auth-page.module.css'

import classNames from 'classnames'
import { useId, useRef } from 'react'
import { useTranslation } from 'react-i18next'

interface AuthFileUploadFieldProps {
  label: string
  fileName?: string
  error?: string
  disabled?: boolean
  onChange: (file: File | null) => void
}

export const AuthFileUploadField = ({
  label,
  fileName,
  error,
  disabled,
  onChange,
}: Readonly<AuthFileUploadFieldProps>) => {
  const { t } = useTranslation()
  const inputId = useId()
  const inputRef = useRef<HTMLInputElement | null>(null)

  return (
    <div className={cn.fileField}>
      <span className={cn.label}>{label}</span>
      <div
        className={classNames(cn.fileArea, error && cn.fileAreaError)}
        tabIndex={-1}
      >
        <input
          id={inputId}
          ref={inputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp"
          className={cn.visuallyHidden}
          disabled={disabled}
          onChange={(event) => onChange(event.target.files?.[0] ?? null)}
        />
        <button
          type="button"
          className={cn.fileButton}
          disabled={disabled}
          onClick={() => inputRef.current?.click()}
        >
          {t('auth.fileUpload.chooseFile')}
        </button>
        <span className={cn.fileHint}>
          {fileName ?? t('auth.fileUpload.hint')}
        </span>
      </div>
      {error ? <span className={cn.error}>{error}</span> : null}
    </div>
  )
}
