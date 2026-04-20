import cn from './meme-item-modals.module.css'

import type { AdminMemeRow, AdminMemeStatus } from '../model/admin-memes'
import { Loader, Switch } from '@mantine/core'
import { Modal } from '@shared/ui'
import { useMutation } from '@tanstack/react-query'
import { useCallback, useId, useState } from 'react'

export interface MemeItemOption {
  value: string
  label: string
}

export interface MemeItemFormModalLabels {
  createTitle: string
  editTitle: string
  close: string
  categoryLabel: string
  nameLabel: string
  durationLabel: string
  activeLabel: string
  back: string
  create: string
  save: string
  creating: string
  saving: string
  submitError: string
  validationRequired: string
}

interface MemeItemFormModalProps {
  mode: 'create' | 'edit'
  isOpen: boolean
  row: AdminMemeRow | null
  categoryOptions: MemeItemOption[]
  nextNumber: number
  labels: MemeItemFormModalLabels
  onClose: () => void
  onCreated?: (row: AdminMemeRow) => void
  onUpdated?: (row: AdminMemeRow) => void
}

const saveMeme = async (input: {
  mode: 'create' | 'edit'
  categoryId: string
  categoryName: string
  name: string
  duration: string
  status: AdminMemeStatus
  row: AdminMemeRow | null
  nextNumber: number
}): Promise<AdminMemeRow> => {
  await new Promise((resolve) => window.setTimeout(resolve, 580))
  const blob = `${input.name}${input.duration}`.toLowerCase()
  if (blob.includes('fail')) {
    throw new Error('meme-save-failed')
  }
  if (!input.name.trim() || !input.duration.trim() || !input.categoryId) {
    throw new Error('meme-validation')
  }
  const thumb = `https://picsum.photos/seed/meme-${Date.now()}/160/90`
  if (input.mode === 'create') {
    return {
      id: `meme-local-${Date.now()}`,
      number: input.nextNumber,
      categoryId: input.categoryId,
      categoryName: input.categoryName,
      name: input.name.trim(),
      videoThumbUrl: thumb,
      duration: input.duration.trim(),
      status: input.status,
    }
  }
  if (!input.row) {
    throw new Error('meme-no-row')
  }
  return {
    ...input.row,
    categoryId: input.categoryId,
    categoryName: input.categoryName,
    name: input.name.trim(),
    duration: input.duration.trim(),
    status: input.status,
    videoThumbUrl: input.row.videoThumbUrl,
  }
}

export const MemeItemFormModal = ({
  mode,
  isOpen,
  row,
  categoryOptions,
  nextNumber,
  labels,
  onClose,
  onCreated,
  onUpdated,
}: Readonly<MemeItemFormModalProps>) => {
  const formId = useId()
  const [categoryId, setCategoryId] = useState(() =>
    mode === 'edit' && row ? row.categoryId : (categoryOptions[0]?.value ?? ''),
  )
  const [name, setName] = useState(() =>
    mode === 'edit' && row ? row.name : '',
  )
  const [duration, setDuration] = useState(() =>
    mode === 'edit' && row ? row.duration : '0:00',
  )
  const [status, setStatus] = useState<AdminMemeStatus>(() =>
    mode === 'edit' && row ? row.status : 'active',
  )
  const [touched, setTouched] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const title = mode === 'create' ? labels.createTitle : labels.editTitle

  const categoryName =
    categoryOptions.find((o) => o.value === categoryId)?.label ?? ''

  const { mutate, isPending } = useMutation({
    mutationFn: saveMeme,
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

  const invalid =
    touched &&
    (!name.trim() ||
      !duration.trim() ||
      !categoryId ||
      categoryOptions.length === 0)

  const handleSubmit = useCallback(
    (event: { preventDefault: () => void }) => {
      event.preventDefault()
      setTouched(true)
      setSubmitError(null)
      if (!name.trim() || !duration.trim() || !categoryId) {
        return
      }
      mutate({
        mode,
        categoryId,
        categoryName,
        name,
        duration,
        status,
        row,
        nextNumber,
      })
    },
    [
      mode,
      categoryId,
      categoryName,
      name,
      duration,
      status,
      row,
      nextNumber,
      mutate,
    ],
  )

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={title}
      closeAriaLabel={labels.close}
      width="lg"
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
            disabled={isPending || categoryOptions.length === 0}
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
        <div className={cn.grid2}>
          <div className={`${cn.field} ${cn.fieldFull}`}>
            <label className={cn.label} htmlFor={`${formId}-cat`}>
              {labels.categoryLabel}
            </label>
            <div
              className={`${cn.inputShell} ${invalid ? cn.inputShellInvalid : ''}`}
            >
              <select
                id={`${formId}-cat`}
                className={cn.select}
                value={categoryId}
                disabled={isPending || categoryOptions.length === 0}
                onChange={(e) => {
                  setCategoryId(e.target.value)
                  setTouched(true)
                }}
              >
                {categoryOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
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
                value={name}
                disabled={isPending}
                onChange={(e) => {
                  setName(e.target.value)
                  setTouched(true)
                }}
                autoComplete="off"
              />
            </div>
          </div>
          <div className={cn.field}>
            <label className={cn.label} htmlFor={`${formId}-dur`}>
              {labels.durationLabel}
            </label>
            <div
              className={`${cn.inputShell} ${invalid ? cn.inputShellInvalid : ''}`}
            >
              <input
                id={`${formId}-dur`}
                className={cn.input}
                value={duration}
                disabled={isPending}
                onChange={(e) => {
                  setDuration(e.target.value)
                  setTouched(true)
                }}
                placeholder="0:42"
              />
            </div>
          </div>
          <div className={`${cn.toggleRow} ${cn.fieldFull}`}>
            <span className={cn.toggleLabel} id={`${formId}-act`}>
              {labels.activeLabel}
            </span>
            <Switch
              checked={status === 'active'}
              onChange={(e) => {
                setStatus(e.currentTarget.checked ? 'active' : 'inactive')
              }}
              disabled={isPending}
              color="#8b0037"
              aria-labelledby={`${formId}-act`}
            />
          </div>
        </div>
        {invalid ? (
          <p className={cn.errorText} role="alert">
            {labels.validationRequired}
          </p>
        ) : null}
        {submitError && !invalid ? (
          <p className={cn.errorText} role="alert">
            {submitError}
          </p>
        ) : null}
      </form>
    </Modal>
  )
}
