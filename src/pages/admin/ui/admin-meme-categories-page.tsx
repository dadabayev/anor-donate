import cn from './admin-bloggers-page.module.css'
import sm from './admin-tts-page.module.css'

import type { AdminMemeCategoryRow } from '../model/admin-meme-categories'
import {
  ADMIN_MEME_CATEGORY_PAGE_SIZE,
  fetchAdminMemeCategories,
  filterMemeCategories,
  nextMemeCategoryNumber,
} from '../model/admin-meme-categories'
import { AdminBloggersLoading } from './components/admin-bloggers-loading'
import { AdminBloggersState } from './components/admin-bloggers-state'
import { MemeTableRowActions } from './components/meme-table-row-actions'
import { MemeCategoryFormModal } from './meme-category-form-modal'
import { ViewMemeCategoryModal } from './view-meme-category-modal'
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

export const AdminMemeCategoriesPage = () => {
  const { t } = useTranslation()
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [createOpen, setCreateOpen] = useState(false)
  const [createFormKey, setCreateFormKey] = useState(0)
  const [editRow, setEditRow] = useState<AdminMemeCategoryRow | null>(null)
  const [viewRow, setViewRow] = useState<AdminMemeCategoryRow | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<AdminMemeCategoryRow | null>(
    null,
  )
  const [removedIds, setRemovedIds] = useState(() => new Set<string>())
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: ['admin-meme-categories'],
    queryFn: fetchAdminMemeCategories,
  })

  const baseRows = useMemo(() => {
    const data = query.data ?? []
    return data.filter((row) => !removedIds.has(row.id))
  }, [query.data, removedIds])

  const nextRowNumber = useMemo(
    () => nextMemeCategoryNumber(baseRows),
    [baseRows],
  )

  const filteredRows = useMemo(
    () => filterMemeCategories(baseRows, search),
    [baseRows, search],
  )

  const totalPages = Math.max(
    1,
    Math.ceil(filteredRows.length / ADMIN_MEME_CATEGORY_PAGE_SIZE),
  )

  const safePage = Math.min(page, totalPages)

  const pageRows = useMemo(() => {
    const start = (safePage - 1) * ADMIN_MEME_CATEGORY_PAGE_SIZE
    return filteredRows.slice(start, start + ADMIN_MEME_CATEGORY_PAGE_SIZE)
  }, [filteredRows, safePage])

  const formLabels = useMemo(
    () => ({
      createTitle: t('admin.memeCategories.addModal.title'),
      editTitle: t('admin.memeCategories.editModal.title'),
      close: t('admin.memeCategories.addModal.close'),
      nameLabel: t('admin.memeCategories.addModal.nameLabel'),
      back: t('admin.memeCategories.addModal.back'),
      create: t('admin.memeCategories.addModal.create'),
      save: t('admin.memeCategories.editModal.save'),
      creating: t('admin.memeCategories.addModal.creating'),
      saving: t('admin.memeCategories.editModal.saving'),
      submitError: t('admin.memeCategories.addModal.submitError'),
      validationRequired: t('admin.memeCategories.addModal.validationRequired'),
    }),
    [t],
  )

  const viewLabels = useMemo(
    () => ({
      title: t('admin.memeCategories.viewModal.title'),
      close: t('admin.memeCategories.viewModal.close'),
      nameCaption: t('admin.memeCategories.viewModal.nameCaption'),
      dateCaption: t('admin.memeCategories.viewModal.dateCaption'),
      dismiss: t('admin.memeCategories.viewModal.dismiss'),
    }),
    [t],
  )

  const handleCreated = useCallback(() => {
    void queryClient.invalidateQueries({ queryKey: ['admin-meme-categories'] })
    void queryClient.invalidateQueries({ queryKey: ['admin-memes'] })
    notifications.show({
      title: t('admin.memeCategories.createToastTitle'),
      message: t('admin.memeCategories.createToastMessage'),
      color: 'green',
    })
  }, [queryClient, t])

  const handleUpdated = useCallback(() => {
    void queryClient.invalidateQueries({ queryKey: ['admin-meme-categories'] })
    void queryClient.invalidateQueries({ queryKey: ['admin-memes'] })
  }, [queryClient])

  const handleRequestDelete = useCallback((row: AdminMemeCategoryRow) => {
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
      title: t('admin.memeCategories.deleteToastTitle'),
      message: t('admin.memeCategories.deleteToastMessage'),
      color: 'green',
    })
  }, [deleteTarget, t])

  const columns: TableColumn<AdminMemeCategoryRow>[] = useMemo(
    () => [
      {
        key: 'number',
        header: headerLabel(t('admin.memeCategories.colNo')),
        width: 72,
        render: (row) => row.number,
      },
      {
        key: 'name',
        header: headerLabel(t('admin.memeCategories.colName')),
        width: '36%',
        render: (row) => row.name,
      },
      {
        key: 'created',
        header: headerLabel(t('admin.memeCategories.colCreated')),
        width: '28%',
        render: (row) => row.createdAt,
      },
      {
        key: 'actions',
        header: headerLabel(t('admin.memeCategories.colActions')),
        width: 180,
        cellClassName: cn.actionsCell,
        render: (row): ReactNode => (
          <MemeTableRowActions
            className={cn.actionsToolbar}
            editLabel={t('admin.memeCategories.editAria')}
            viewLabel={t('admin.memeCategories.viewAria')}
            deleteLabel={t('admin.memeCategories.deleteAria')}
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

  if (query.isLoading) {
    return <AdminBloggersLoading title={t('admin.memeCategories.pageTitle')} />
  }

  if (query.isError) {
    return (
      <AdminBloggersState
        title={t('admin.memeCategories.pageTitle')}
        stateTitle={t('admin.memeCategories.errorTitle')}
        text={t('admin.memeCategories.errorText')}
        actionLabel={t('admin.memeCategories.retry')}
        icon={<IconAlertTriangle size={44} stroke={1.8} color="#b42318" />}
        onAction={() => {
          void query.refetch()
        }}
      />
    )
  }

  return (
    <section className={cn.page}>
      <header className={cn.headerBlock}>
        <h1 className={cn.title}>{t('admin.memeCategories.pageTitle')}</h1>
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
              placeholder={t('admin.memeCategories.searchPlaceholder')}
              aria-label={t('admin.memeCategories.searchAria')}
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
            {t('admin.memeCategories.createCategory')}
          </button>
        </div>
      </header>

      {baseRows.length === 0 ? (
        <AdminBloggersState
          embedded
          title={t('admin.memeCategories.pageTitle')}
          stateTitle={t('admin.memeCategories.emptyTitle')}
          text={t('admin.memeCategories.emptyText')}
          actionLabel={t('admin.memeCategories.retry')}
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
              emptyState={t('admin.memeCategories.noResults')}
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
              aria-label={t('admin.memeCategories.paginationAria')}
            />
          ) : null}
        </>
      )}

      <MemeCategoryFormModal
        key={`mc-create-${createFormKey}`}
        mode="create"
        isOpen={createOpen}
        row={null}
        nextNumber={nextRowNumber}
        labels={formLabels}
        onClose={() => {
          setCreateOpen(false)
        }}
        onCreated={handleCreated}
      />

      <MemeCategoryFormModal
        key={editRow ? `mc-edit-${editRow.id}` : 'mc-edit-closed'}
        mode="edit"
        isOpen={editRow !== null}
        row={editRow}
        nextNumber={nextRowNumber}
        labels={formLabels}
        onClose={() => {
          setEditRow(null)
        }}
        onUpdated={() => {
          handleUpdated()
          notifications.show({
            title: t('admin.memeCategories.editToastTitle'),
            message: t('admin.memeCategories.editToastMessage'),
            color: 'green',
          })
        }}
      />

      <ViewMemeCategoryModal
        category={viewRow}
        isOpen={viewRow !== null}
        labels={viewLabels}
        onClose={() => {
          setViewRow(null)
        }}
      />

      <ConfirmModal
        cancelLabel={t('admin.memeCategories.deleteModal.cancel')}
        closeAriaLabel={t('admin.memeCategories.deleteModal.closeAria')}
        confirmLabel={t('admin.memeCategories.deleteModal.confirm')}
        confirmingLabel={t('admin.memeCategories.deleteModal.confirming')}
        isOpen={deleteTarget !== null}
        message={
          deleteTarget
            ? t('admin.memeCategories.deleteModal.message', {
                name: deleteTarget.name,
              })
            : ''
        }
        title={t('admin.memeCategories.deleteModal.title')}
        onCancel={() => {
          setDeleteTarget(null)
        }}
        onConfirm={handleConfirmDelete}
      />
    </section>
  )
}
