import cn from './admin-bloggers-page.module.css'
import mm from './admin-memes-page.module.css'
import sm from './admin-tts-page.module.css'

import { fetchAdminMemeCategories } from '../model/admin-meme-categories'
import type { AdminMemeRow } from '../model/admin-memes'
import {
  ADMIN_MEME_PAGE_SIZE,
  fetchAdminMemes,
  filterMemes,
  memeThumbSrc,
  nextMemeNumber,
} from '../model/admin-memes'
import { AdminBloggersLoading } from './components/admin-bloggers-loading'
import { AdminBloggersState } from './components/admin-bloggers-state'
import { MemeTableRowActions } from './components/meme-table-row-actions'
import type { MemeItemOption } from './meme-item-form-modal'
import { MemeItemFormModal } from './meme-item-form-modal'
import { ViewMemeModal } from './view-meme-modal'
import { Pagination } from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { ConfirmModal, Table, type TableColumn } from '@shared/ui'
import {
  IconAlertTriangle,
  IconArrowsUpDown,
  IconSearch,
} from '@tabler/icons-react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import classNames from 'classnames'
import { type ReactNode, useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

const headerLabel = (label: string) => (
  <span className={cn.headerLabel}>
    <span>{label}</span>
    <IconArrowsUpDown size={14} stroke={1.8} />
  </span>
)

export const AdminMemesPage = () => {
  const { t } = useTranslation()
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [createOpen, setCreateOpen] = useState(false)
  const [createFormKey, setCreateFormKey] = useState(0)
  const [editRow, setEditRow] = useState<AdminMemeRow | null>(null)
  const [viewRow, setViewRow] = useState<AdminMemeRow | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<AdminMemeRow | null>(null)
  const [removedIds, setRemovedIds] = useState(() => new Set<string>())
  const queryClient = useQueryClient()

  const categoriesQuery = useQuery({
    queryKey: ['admin-meme-categories'],
    queryFn: fetchAdminMemeCategories,
  })

  const query = useQuery({
    queryKey: ['admin-memes', categoriesQuery.dataUpdatedAt],
    queryFn: () =>
      fetchAdminMemes(
        new Map(
          (categoriesQuery.data ?? []).map((c) => [c.id, c.name] as const),
        ),
      ),
    enabled: categoriesQuery.isSuccess,
  })

  const categoryOptions: MemeItemOption[] = useMemo(() => {
    return (categoriesQuery.data ?? []).map((r) => ({
      value: r.id,
      label: r.name,
    }))
  }, [categoriesQuery.data])

  const baseRows = useMemo(() => {
    const data = query.data ?? []
    return data.filter((row) => !removedIds.has(row.id))
  }, [query.data, removedIds])

  const nextRowNumber = useMemo(() => nextMemeNumber(baseRows), [baseRows])

  const filteredRows = useMemo(
    () => filterMemes(baseRows, search),
    [baseRows, search],
  )

  const totalPages = Math.max(
    1,
    Math.ceil(filteredRows.length / ADMIN_MEME_PAGE_SIZE),
  )

  const safePage = Math.min(page, totalPages)

  const pageRows = useMemo(() => {
    const start = (safePage - 1) * ADMIN_MEME_PAGE_SIZE
    return filteredRows.slice(start, start + ADMIN_MEME_PAGE_SIZE)
  }, [filteredRows, safePage])

  const formLabels = useMemo(
    () => ({
      createTitle: t('admin.memes.addModal.title'),
      editTitle: t('admin.memes.editModal.title'),
      close: t('admin.memes.addModal.close'),
      categoryLabel: t('admin.memes.addModal.categoryLabel'),
      nameLabel: t('admin.memes.addModal.nameLabel'),
      durationLabel: t('admin.memes.addModal.durationLabel'),
      activeLabel: t('admin.memes.addModal.activeLabel'),
      back: t('admin.memes.addModal.back'),
      create: t('admin.memes.addModal.create'),
      save: t('admin.memes.editModal.save'),
      creating: t('admin.memes.addModal.creating'),
      saving: t('admin.memes.editModal.saving'),
      submitError: t('admin.memes.addModal.submitError'),
      validationRequired: t('admin.memes.addModal.validationRequired'),
    }),
    [t],
  )

  const viewLabels = useMemo(
    () => ({
      title: t('admin.memes.viewModal.title'),
      close: t('admin.memes.viewModal.close'),
      dismiss: t('admin.memes.viewModal.dismiss'),
      categoryCaption: t('admin.memes.viewModal.categoryCaption'),
      nameCaption: t('admin.memes.viewModal.nameCaption'),
      durationCaption: t('admin.memes.viewModal.durationCaption'),
      statusCaption: t('admin.memes.viewModal.statusCaption'),
      active: t('admin.memes.statusActive'),
      inactive: t('admin.memes.statusInactive'),
    }),
    [t],
  )

  const handleCreated = useCallback(() => {
    void queryClient.invalidateQueries({ queryKey: ['admin-memes'] })
    notifications.show({
      title: t('admin.memes.createToastTitle'),
      message: t('admin.memes.createToastMessage'),
      color: 'green',
    })
  }, [queryClient, t])

  const handleUpdated = useCallback(() => {
    void queryClient.invalidateQueries({ queryKey: ['admin-memes'] })
  }, [queryClient])

  const handleRequestDelete = useCallback((row: AdminMemeRow) => {
    setDeleteTarget(row)
  }, [])

  const handleConfirmDelete = useCallback(async () => {
    if (!deleteTarget) {
      return
    }
    const id = deleteTarget.id
    setRemovedIds((prev) => new Set(prev).add(id))
    setDeleteTarget(null)
    notifications.show({
      title: t('admin.memes.deleteToastTitle'),
      message: t('admin.memes.deleteToastMessage'),
      color: 'green',
    })
  }, [deleteTarget, t])

  const columns: TableColumn<AdminMemeRow>[] = useMemo(
    () => [
      {
        key: 'number',
        header: headerLabel(t('admin.memes.colNo')),
        width: 64,
        render: (row) => row.number,
      },
      {
        key: 'category',
        header: headerLabel(t('admin.memes.colCategory')),
        width: '16%',
        render: (row) => row.categoryName,
      },
      {
        key: 'name',
        header: headerLabel(t('admin.memes.colName')),
        width: '16%',
        render: (row) => row.name,
      },
      {
        key: 'video',
        header: headerLabel(t('admin.memes.colVideo')),
        width: 120,
        cellClassName: cn.channelCell,
        render: (row) => (
          <img
            className={mm.thumb}
            src={memeThumbSrc(row)}
            alt=""
            loading="lazy"
            decoding="async"
          />
        ),
      },
      {
        key: 'duration',
        header: headerLabel(t('admin.memes.colDuration')),
        width: 100,
        render: (row) => row.duration,
      },
      {
        key: 'status',
        header: headerLabel(t('admin.memes.colStatus')),
        width: 108,
        render: (row) => (
          <span
            className={
              row.status === 'active' ? mm.statusActive : mm.statusInactive
            }
          >
            {row.status === 'active'
              ? t('admin.memes.statusActive')
              : t('admin.memes.statusInactive')}
          </span>
        ),
      },
      {
        key: 'actions',
        header: headerLabel(t('admin.memes.colActions')),
        width: 180,
        cellClassName: cn.actionsCell,
        render: (row): ReactNode => (
          <MemeTableRowActions
            className={cn.actionsToolbar}
            editLabel={t('admin.memes.editAria')}
            viewLabel={t('admin.memes.viewAria')}
            deleteLabel={t('admin.memes.deleteAria')}
            onEdit={() => {
              setEditRow(row)
            }}
            onView={() => {
              setViewRow(row)
            }}
            onDelete={() => {
              handleRequestDelete(row)
            }}
          />
        ),
      },
    ],
    [handleRequestDelete, t],
  )

  const loadingCategories = categoriesQuery.isLoading
  const pageLoading = query.isLoading || loadingCategories

  if (pageLoading) {
    return <AdminBloggersLoading title={t('admin.memes.pageTitle')} />
  }

  if (query.isError || categoriesQuery.isError) {
    return (
      <AdminBloggersState
        title={t('admin.memes.pageTitle')}
        stateTitle={t('admin.memes.errorTitle')}
        text={t('admin.memes.errorText')}
        actionLabel={t('admin.memes.retry')}
        icon={<IconAlertTriangle size={44} stroke={1.8} color="#b42318" />}
        onAction={() => {
          void query.refetch()
          void categoriesQuery.refetch()
        }}
      />
    )
  }

  return (
    <section className={cn.page}>
      <header className={cn.headerBlock}>
        <h1 className={cn.title}>{t('admin.memes.pageTitle')}</h1>
        <div className={sm.toolbar}>
          <div className={classNames(cn.searchWrap, sm.searchGrow)}>
            <input
              className={cn.searchInput}
              type="search"
              value={search}
              onChange={(event) => {
                setSearch(event.target.value)
                setPage(1)
              }}
              placeholder={t('admin.memes.searchPlaceholder')}
              aria-label={t('admin.memes.searchAria')}
            />
            <IconSearch className={cn.searchIcon} size={22} stroke={1.8} />
          </div>
          <button
            type="button"
            className={sm.addButton}
            onClick={() => {
              setCreateFormKey((key) => key + 1)
              setCreateOpen(true)
            }}
          >
            {t('admin.memes.addMeme')}
          </button>
        </div>
      </header>

      {baseRows.length === 0 ? (
        <AdminBloggersState
          embedded
          title={t('admin.memes.pageTitle')}
          stateTitle={t('admin.memes.emptyTitle')}
          text={t('admin.memes.emptyText')}
          actionLabel={t('admin.memes.retry')}
          image="/assets/empty-item.svg"
          onAction={() => {
            setRemovedIds(new Set())
            void query.refetch()
          }}
        />
      ) : (
        <>
          <section className={cn.tableWrap}>
            <Table
              variant="history"
              columns={columns}
              rows={pageRows}
              getRowKey={(row) => row.id}
              emptyState={t('admin.memes.noResults')}
            />
          </section>

          {filteredRows.length > 0 ? (
            <Pagination
              classNames={{
                root: cn.pagination,
                control: cn.paginationControl,
                dots: cn.paginationDots,
              }}
              total={totalPages}
              value={safePage}
              onChange={setPage}
              siblings={1}
              boundaries={1}
              gap="9px"
              aria-label={t('admin.memes.paginationAria')}
            />
          ) : null}
        </>
      )}

      <MemeItemFormModal
        key={`mi-create-${createFormKey}`}
        mode="create"
        isOpen={createOpen}
        row={null}
        categoryOptions={categoryOptions}
        nextNumber={nextRowNumber}
        labels={formLabels}
        onClose={() => {
          setCreateOpen(false)
        }}
        onCreated={handleCreated}
      />

      <MemeItemFormModal
        key={editRow ? `mi-edit-${editRow.id}` : 'mi-edit-closed'}
        mode="edit"
        isOpen={editRow !== null}
        row={editRow}
        categoryOptions={categoryOptions}
        nextNumber={nextRowNumber}
        labels={formLabels}
        onClose={() => {
          setEditRow(null)
        }}
        onUpdated={() => {
          handleUpdated()
          notifications.show({
            title: t('admin.memes.editToastTitle'),
            message: t('admin.memes.editToastMessage'),
            color: 'green',
          })
        }}
      />

      <ViewMemeModal
        meme={viewRow}
        isOpen={viewRow !== null}
        labels={viewLabels}
        onClose={() => {
          setViewRow(null)
        }}
      />

      <ConfirmModal
        cancelLabel={t('admin.memes.deleteModal.cancel')}
        closeAriaLabel={t('admin.memes.deleteModal.closeAria')}
        confirmLabel={t('admin.memes.deleteModal.confirm')}
        confirmingLabel={t('admin.memes.deleteModal.confirming')}
        isOpen={deleteTarget !== null}
        message={
          deleteTarget
            ? t('admin.memes.deleteModal.message', {
                name: deleteTarget.name,
              })
            : ''
        }
        title={t('admin.memes.deleteModal.title')}
        onCancel={() => {
          setDeleteTarget(null)
        }}
        onConfirm={handleConfirmDelete}
      />
    </section>
  )
}
