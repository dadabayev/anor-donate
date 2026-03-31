import cn from './memes-page.module.css'
import shared from './memes-shared.module.css'

import { deleteMeme, fetchMemesDashboard } from '../api/memes-api'
import {
  type MemeItem,
  MEMES_COPY_ACTION,
  MEMES_CREATE_ACTION,
  MEMES_DELETE_ERROR,
  MEMES_DELETE_SUCCESS_TOAST,
  MEMES_EMPTY_ACTION,
  MEMES_EMPTY_TEXT,
  MEMES_EMPTY_TITLE,
  MEMES_ERROR_TEXT,
  MEMES_ERROR_TITLE,
  MEMES_LIST_SUBTITLE,
  MEMES_PAGE_MODE_KEY,
  MEMES_PAGE_TITLE,
  MEMES_RETRY_ACTION,
  type MemesDashboardData,
} from '../model/memes'
import {
  MemeCard,
  MemeDeleteConfirmModal,
  MemesLoading,
  MemesState,
} from './components'
import { notifications } from '@mantine/notifications'
import { ASSETS } from '@shared/constants'
import { PaginationStepper } from '@shared/ui'
import { IconLink } from '@tabler/icons-react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export const MemesPage = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [copiedText, setCopiedText] = useState('')
  const [memeToDelete, setMemeToDelete] = useState<MemeItem | null>(null)

  const query = useQuery({
    queryKey: ['memes-dashboard'],
    queryFn: fetchMemesDashboard,
  })

  const deleteMutation = useMutation({
    mutationFn: deleteMeme,
    onSuccess: (_, memeId) => {
      queryClient.setQueryData<MemesDashboardData>(
        ['memes-dashboard'],
        (old) => {
          if (!old) {
            return old
          }
          return {
            ...old,
            memes: old.memes.filter((m) => m.id !== memeId),
          }
        },
      )
      notifications.show({
        title: 'Bajarildi',
        message: MEMES_DELETE_SUCCESS_TOAST,
        color: 'teal',
      })
      setMemeToDelete(null)
    },
  })

  const dashboard = query.data ?? null

  const handleCloseDeleteModal = () => {
    if (deleteMutation.isPending) {
      return
    }
    deleteMutation.reset()
    setMemeToDelete(null)
  }

  const handleConfirmDelete = () => {
    if (!memeToDelete) {
      return
    }
    deleteMutation.mutate(memeToDelete.id)
  }

  const handleRetry = () => {
    window.localStorage.removeItem(MEMES_PAGE_MODE_KEY)
    void query.refetch()
  }

  const handleCopy = async () => {
    if (!dashboard?.streamLink) {
      return
    }

    try {
      await navigator.clipboard.writeText(dashboard.streamLink)
      setCopiedText('Havola nusxalandi')
    } catch {
      setCopiedText('Nusxalashda xatolik')
    } finally {
      window.setTimeout(() => setCopiedText(''), 1800)
    }
  }

  if (query.isLoading) {
    return <MemesLoading title={MEMES_PAGE_TITLE} />
  }

  if (query.isError) {
    return (
      <MemesState
        title={MEMES_PAGE_TITLE}
        stateTitle={MEMES_ERROR_TITLE}
        text={MEMES_ERROR_TEXT}
        actionLabel={MEMES_RETRY_ACTION}
        image={ASSETS.BUG_FIXING}
        onAction={handleRetry}
      />
    )
  }

  if (!dashboard || dashboard.memes.length === 0) {
    return (
      <MemesState
        title={MEMES_PAGE_TITLE}
        stateTitle={MEMES_EMPTY_TITLE}
        text={MEMES_EMPTY_TEXT}
        actionLabel={MEMES_EMPTY_ACTION}
        image={ASSETS.DEVELOPMENT}
        onAction={() => {
          void navigate('/memes/create')
        }}
      />
    )
  }

  return (
    <section className={cn.page}>
      <div className={cn.column}>
        <header className={cn.hero}>
          <h1 className={cn.title}>{MEMES_PAGE_TITLE}</h1>
          <p className={cn.subtitle}>{MEMES_LIST_SUBTITLE}</p>
          {query.isFetching ? (
            <span className={cn.status}>Yangilanmoqda...</span>
          ) : null}
          <button
            type="button"
            className={cn.primaryButton}
            onClick={() => {
              void navigate('/memes/create')
            }}
          >
            {MEMES_CREATE_ACTION}
          </button>
        </header>

        <section className={cn.linkCard}>
          <h2 className={cn.linkSectionTitle}>Strim uchun havola:</h2>
          <div className={cn.linkRow}>
            <label className={cn.linkInputWrap}>
              <input
                className={cn.linkInput}
                type="url"
                value={dashboard.streamLink}
                readOnly
                aria-label="Strim uchun havola"
              />
            </label>
            <button
              type="button"
              className={cn.copyButton}
              aria-label={MEMES_COPY_ACTION}
              onClick={handleCopy}
            >
              <IconLink size={22} stroke={2} />
            </button>
          </div>
          <span aria-live="polite" className={cn.status}>
            {copiedText}
          </span>
        </section>

        <section className={cn.listCard}>
          <h2 className={cn.cardTitle}>Mening Memlar</h2>
          <div className={shared.memeGrid}>
            {dashboard.memes.map((meme) => (
              <MemeCard
                key={meme.id}
                actionLabel=""
                imageUrl={meme.imageUrl}
                priceUzs={meme.priceUzs}
                showDelete
                onDeleteClick={() => {
                  deleteMutation.reset()
                  setMemeToDelete(meme)
                }}
              />
            ))}
          </div>
          <div className={cn.listCardFooter}>
            <PaginationStepper />
          </div>
        </section>
      </div>

      <MemeDeleteConfirmModal
        errorMessage={deleteMutation.isError ? MEMES_DELETE_ERROR : null}
        isOpen={memeToDelete !== null}
        isPending={deleteMutation.isPending}
        meme={memeToDelete}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
      />
    </section>
  )
}
