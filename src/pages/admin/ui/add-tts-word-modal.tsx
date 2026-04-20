import cn from './add-tts-word-modal.module.css'

import type { AdminTtsWordRow } from '../model/admin-tts-words'
import { Loader, Switch } from '@mantine/core'
import { Modal } from '@shared/ui'
import { useMutation } from '@tanstack/react-query'
import { useCallback, useId, useState } from 'react'

export interface AddTtsWordModalLabels {
  title: string
  close: string
  fromLabel: string
  toLabel: string
  standardFilterLabel: string
  back: string
  create: string
  creating: string
  submitError: string
  validationRequired: string
}

interface AddTtsWordModalProps {
  isOpen: boolean
  nextRowNumber: number
  labels: AddTtsWordModalLabels
  onClose: () => void
  onCreated: (row: AdminTtsWordRow) => void
}

const submitWord = async (payload: {
  fromWord: string
  toWord: string
  isStandardFilter: boolean
  number: number
  createdAt: string
}): Promise<AdminTtsWordRow> => {
  await new Promise((resolve) => window.setTimeout(resolve, 600))
  const combined = `${payload.fromWord}${payload.toWord}`.toLowerCase()
  if (combined.includes('fail')) {
    throw new Error('tts-create-failed')
  }
  return {
    id: `tts-local-${Date.now()}`,
    number: payload.number,
    fromWord: payload.fromWord.trim(),
    toWord: payload.toWord.trim(),
    isStandardFilter: payload.isStandardFilter,
    createdAt: payload.createdAt,
  }
}

export const AddTtsWordModal = ({
  isOpen,
  nextRowNumber,
  labels,
  onClose,
  onCreated,
}: Readonly<AddTtsWordModalProps>) => {
  const formId = useId()
  const [fromWord, setFromWord] = useState('')
  const [toWord, setToWord] = useState('')
  const [isStandardFilter, setIsStandardFilter] = useState(true)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const { mutate, isPending } = useMutation({
    mutationFn: submitWord,
    onSuccess: (row) => {
      onCreated(row)
      setFromWord('')
      setToWord('')
      setIsStandardFilter(true)
      setSubmitError(null)
      onClose()
    },
    onError: () => {
      setSubmitError(labels.submitError)
    },
  })

  const handleClose = useCallback(() => {
    if (isPending) {
      return
    }
    setSubmitError(null)
    onClose()
  }, [isPending, onClose])

  const handleSubmit = useCallback(
    (event: { preventDefault: () => void }) => {
      event.preventDefault()
      setSubmitError(null)
      if (!fromWord.trim() || !toWord.trim()) {
        setSubmitError(labels.validationRequired)
        return
      }
      const pad = (n: number) => String(n).padStart(2, '0')
      const d = new Date()
      const createdAt = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`
      mutate({
        fromWord,
        toWord,
        isStandardFilter,
        number: nextRowNumber,
        createdAt,
      })
    },
    [
      fromWord,
      toWord,
      isStandardFilter,
      nextRowNumber,
      labels.validationRequired,
      mutate,
    ],
  )

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={labels.title}
      closeAriaLabel={labels.close}
      width="md"
      dismissible={!isPending}
      closeButtonDisabled={isPending}
      footer={
        <div className={cn.footer}>
          <button
            type="button"
            className={cn.backButton}
            disabled={isPending}
            onClick={handleClose}
          >
            {labels.back}
          </button>
          <button
            type="submit"
            form={formId}
            className={cn.submitButton}
            disabled={isPending}
          >
            {isPending ? (
              <>
                <Loader size={18} color="white" />
                <span>{labels.creating}</span>
              </>
            ) : (
              labels.create
            )}
          </button>
        </div>
      }
    >
      <form id={formId} className={cn.form} onSubmit={handleSubmit} noValidate>
        <div className={cn.grid}>
          <div className={cn.field}>
            <label className={cn.label} htmlFor={`${formId}-from`}>
              {labels.fromLabel}
            </label>
            <div className={cn.inputShell}>
              <input
                id={`${formId}-from`}
                className={cn.input}
                name="fromWord"
                value={fromWord}
                disabled={isPending}
                onChange={(e) => {
                  setFromWord(e.target.value)
                }}
                autoComplete="off"
              />
            </div>
          </div>
          <div className={cn.field}>
            <label className={cn.label} htmlFor={`${formId}-to`}>
              {labels.toLabel}
            </label>
            <div className={cn.inputShell}>
              <input
                id={`${formId}-to`}
                className={cn.input}
                name="toWord"
                value={toWord}
                disabled={isPending}
                onChange={(e) => {
                  setToWord(e.target.value)
                }}
                autoComplete="off"
              />
            </div>
          </div>
          <div className={cn.toggleRow}>
            <span className={cn.toggleLabel} id={`${formId}-toggle-label`}>
              {labels.standardFilterLabel}
            </span>
            <Switch
              checked={isStandardFilter}
              onChange={(e) => {
                setIsStandardFilter(e.currentTarget.checked)
              }}
              disabled={isPending}
              color="#8b0037"
              aria-labelledby={`${formId}-toggle-label`}
            />
          </div>
        </div>
        {submitError ? (
          <p className={cn.errorText} role="alert">
            {submitError}
          </p>
        ) : null}
      </form>
    </Modal>
  )
}
