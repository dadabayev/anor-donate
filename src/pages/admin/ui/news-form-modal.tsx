import cn from './news-modals.module.css'

import type { AdminNewsRow, AdminNewsStatus } from '../model/admin-news'
import { Loader, Switch } from '@mantine/core'
import { Modal } from '@shared/ui'
import { useMutation } from '@tanstack/react-query'
import { useCallback, useId, useState } from 'react'

export interface NewsFormModalLabels {
  createTitle: string
  editTitle: string
  close: string
  titleLabel: string
  coverLabel: string
  bodyLabel: string
  publishedLabel: string
  back: string
  create: string
  save: string
  creating: string
  saving: string
  submitError: string
  validationRequired: string
}

interface NewsFormModalProps {
  mode: 'create' | 'edit'
  isOpen: boolean
  row: AdminNewsRow | null
  nextNumber: number
  labels: NewsFormModalLabels
  onClose: () => void
  onCreated?: (row: AdminNewsRow) => void
  onUpdated?: (row: AdminNewsRow) => void
}

const saveNews = async (input: {
  mode: 'create' | 'edit'
  title: string
  coverImageUrl: string
  body: string
  status: AdminNewsStatus
  row: AdminNewsRow | null
  nextNumber: number
}): Promise<AdminNewsRow> => {
  await new Promise((resolve) => window.setTimeout(resolve, 560))
  const blob = `${input.title}${input.body}`.toLowerCase()
  if (blob.includes('fail')) {
    throw new Error('news-save-failed')
  }
  if (!input.title.trim() || !input.body.trim()) {
    throw new Error('news-validation')
  }
  const cover =
    input.coverImageUrl.trim() ||
    `https://picsum.photos/seed/news-${Date.now()}/320/180`
  if (input.mode === 'create') {
    const d = new Date()
    const pad = (n: number) => String(n).padStart(2, '0')
    const createdAt = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`
    return {
      id: `news-local-${Date.now()}`,
      number: input.nextNumber,
      title: input.title.trim(),
      body: input.body.trim(),
      coverImageUrl: cover,
      createdAt,
      status: input.status,
    }
  }
  if (!input.row) {
    throw new Error('news-no-row')
  }
  return {
    ...input.row,
    title: input.title.trim(),
    body: input.body.trim(),
    coverImageUrl: cover,
    status: input.status,
  }
}

export const NewsFormModal = ({
  mode,
  isOpen,
  row,
  nextNumber,
  labels,
  onClose,
  onCreated,
  onUpdated,
}: Readonly<NewsFormModalProps>) => {
  const formId = useId()
  const [title, setTitle] = useState(() =>
    mode === 'edit' && row ? row.title : '',
  )
  const [coverImageUrl, setCoverImageUrl] = useState(() =>
    mode === 'edit' && row ? row.coverImageUrl : '',
  )
  const [body, setBody] = useState(() =>
    mode === 'edit' && row ? row.body : '',
  )
  const [published, setPublished] = useState(() =>
    mode === 'edit' && row ? row.status === 'published' : true,
  )
  const [touched, setTouched] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const formTitle = mode === 'create' ? labels.createTitle : labels.editTitle

  const { mutate, isPending } = useMutation({
    mutationFn: saveNews,
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

  const invalid = touched && (!title.trim() || !body.trim())

  const handleSubmit = useCallback(
    (event: { preventDefault: () => void }) => {
      event.preventDefault()
      setTouched(true)
      setSubmitError(null)
      if (!title.trim() || !body.trim()) {
        return
      }
      mutate({
        mode,
        title,
        coverImageUrl,
        body,
        status: published ? 'published' : 'draft',
        row,
        nextNumber,
      })
    },
    [mode, title, coverImageUrl, body, published, row, nextNumber, mutate],
  )

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={formTitle}
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
        <div className={cn.grid2}>
          <div className={cn.field}>
            <label className={cn.label} htmlFor={`${formId}-title`}>
              {labels.titleLabel}
            </label>
            <div
              className={`${cn.inputShell} ${
                invalid && !title.trim() ? cn.inputShellInvalid : ''
              }`}
            >
              <input
                id={`${formId}-title`}
                className={cn.input}
                value={title}
                disabled={isPending}
                onChange={(e) => {
                  setTitle(e.target.value)
                  setTouched(true)
                }}
                autoComplete="off"
              />
            </div>
          </div>
          <div className={cn.field}>
            <label className={cn.label} htmlFor={`${formId}-cover`}>
              {labels.coverLabel}
            </label>
            <div className={cn.inputShell}>
              <input
                id={`${formId}-cover`}
                className={cn.input}
                value={coverImageUrl}
                disabled={isPending}
                onChange={(e) => {
                  setCoverImageUrl(e.target.value)
                  setTouched(true)
                }}
                placeholder="https://"
                autoComplete="off"
                inputMode="url"
              />
            </div>
          </div>
          <div className={`${cn.field} ${cn.fieldFull}`}>
            <label className={cn.label} htmlFor={`${formId}-body`}>
              {labels.bodyLabel}
            </label>
            <div
              className={`${cn.inputShell} ${cn.textareaShell} ${
                invalid && !body.trim() ? cn.inputShellInvalid : ''
              }`}
            >
              <textarea
                id={`${formId}-body`}
                className={cn.textarea}
                value={body}
                disabled={isPending}
                onChange={(e) => {
                  setBody(e.target.value)
                  setTouched(true)
                }}
                rows={5}
              />
            </div>
          </div>
          <div className={`${cn.toggleRow} ${cn.fieldFull}`}>
            <span className={cn.toggleLabel} id={`${formId}-pub`}>
              {labels.publishedLabel}
            </span>
            <Switch
              checked={published}
              onChange={(e) => {
                setPublished(e.currentTarget.checked)
              }}
              disabled={isPending}
              color="#8b0037"
              aria-labelledby={`${formId}-pub`}
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
