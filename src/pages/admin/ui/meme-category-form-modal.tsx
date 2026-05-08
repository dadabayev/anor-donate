import cn from './meme-category-modals.module.css'

import type { AdminMemeCategoryRow } from '../model/admin-meme-categories'
import { saveAdminMemeCategory } from '../model/admin-meme-categories'
import { Loader } from '@mantine/core'
import { Modal } from '@shared/ui'
import { useMutation } from '@tanstack/react-query'
import { useCallback, useId, useState } from 'react'

export interface MemeCategoryFormModalLabels {
  createTitle: string
  editTitle: string
  close: string
  nameLabel: string
  back: string
  create: string
  save: string
  creating: string
  saving: string
  submitError: string
  validationRequired: string
}

interface MemeCategoryFormModalProps {
  mode: 'create' | 'edit'
  isOpen: boolean
  row: AdminMemeCategoryRow | null
  nextNumber: number
  labels: MemeCategoryFormModalLabels
  onClose: () => void
  onCreated?: (row: AdminMemeCategoryRow) => void
  onUpdated?: (row: AdminMemeCategoryRow) => void
}

const runSave = async (input: {
  mode: 'create' | 'edit'
  name: string
  row: AdminMemeCategoryRow | null
  nextNumber: number
}): Promise<AdminMemeCategoryRow> => {
  if (!input.name.trim()) {
    throw new Error('meme-category-empty')
  }
  return saveAdminMemeCategory({
    mode: input.mode,
    name: input.name,
    rowId: input.row?.id ?? null,
    rowNumber: input.row?.number,
    nextNumber: input.nextNumber,
  })
}

export const MemeCategoryFormModal = ({
  mode,
  isOpen,
  row,
  nextNumber,
  labels,
  onClose,
  onCreated,
  onUpdated,
}: Readonly<MemeCategoryFormModalProps>) => {
  const formId = useId()
  const [name, setName] = useState(() =>
    mode === 'edit' && row ? row.name : '',
  )
  const [touched, setTouched] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const title = mode === 'create' ? labels.createTitle : labels.editTitle

  const { mutate, isPending } = useMutation({
    mutationFn: runSave,
    onSuccess: (result) => {
      if (mode === 'create') {
        onCreated?.(result)
      } else {
        onUpdated?.(result)
      }
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

  const invalid = touched && !name.trim()

  const handleSubmit = useCallback(
    (event: { preventDefault: () => void }) => {
      event.preventDefault()
      setTouched(true)
      setSubmitError(null)
      if (!name.trim()) {
        return
      }
      mutate({
        mode,
        name,
        row,
        nextNumber,
      })
    },
    [mode, name, row, nextNumber, mutate],
  )

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={title}
      closeAriaLabel={labels.close}
      width="md"
      dismissible={!isPending}
      closeButtonDisabled={isPending}
      footer={
        <div className={cn.footer}>
          <button
            type="button"
            className={cn.secondaryButton}
            disabled={isPending}
            onClick={handleClose}
          >
            {labels.back}
          </button>
          <button
            type="submit"
            form={formId}
            className={cn.primaryButton}
            disabled={isPending}
          >
            {isPending ? (
              <>
                <Loader size={18} color="white" />
                <span>
                  {mode === 'create' ? labels.creating : labels.saving}
                </span>
              </>
            ) : mode === 'create' ? (
              labels.create
            ) : (
              labels.save
            )}
          </button>
        </div>
      }
    >
      <form id={formId} className={cn.form} onSubmit={handleSubmit} noValidate>
        <div className={cn.field}>
          <label className={cn.label} htmlFor={`${formId}-name`}>
            {labels.nameLabel}
          </label>
          <div
            className={`${cn.inputShell} ${invalid ? cn.inputShellInvalid : ''}`}
          >
            <input
              id={`${formId}-name`}
              className={cn.input}
              name="name"
              value={name}
              disabled={isPending}
              onChange={(e) => {
                setName(e.target.value)
                setTouched(true)
              }}
              autoComplete="off"
              aria-invalid={invalid}
              aria-describedby={
                invalid || submitError ? `${formId}-err` : undefined
              }
            />
          </div>
        </div>
        {invalid ? (
          <p id={`${formId}-err`} className={cn.errorText} role="alert">
            {labels.validationRequired}
          </p>
        ) : null}
        {submitError && !invalid ? (
          <p id={`${formId}-err`} className={cn.errorText} role="alert">
            {submitError}
          </p>
        ) : null}
      </form>
    </Modal>
  )
}
