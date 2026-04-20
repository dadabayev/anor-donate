import cn from './admin-bloggers-page.module.css'
import nm from './admin-news-page.module.css'
import sm from './admin-tts-page.module.css'

import type { AdminNewsRow } from '../model/admin-news'
import {
  ADMIN_NEWS_PAGE_SIZE,
  fetchAdminNews,
  filterAdminNews,
  nextNewsNumber,
} from '../model/admin-news'
import { AdminBloggersLoading } from './components/admin-bloggers-loading'
import { AdminBloggersState } from './components/admin-bloggers-state'
import { MemeTableRowActions } from './components/meme-table-row-actions'
import { NewsFormModal } from './news-form-modal'
import { ViewNewsModal } from './view-news-modal'
import { Pagination } from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { ConfirmModal, Table, type TableColumn } from '@shared/ui'
import {
  IconAlertTriangle,
  IconArrowsUpDown,
  IconSearch,
} from '@tabler/icons-react'
import { useQuery } from '@tanstack/react-query'
import classNames from 'classnames'
import { type ReactNode, useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

const headerLabel = (label: string) => (
  <span className={cn.headerLabel}>
    <span>{label}</span>
    <IconArrowsUpDown size={14} stroke={1.8} />
  </span>
)

export const AdminNewsPage = () => {
  const { t } = useTranslation()
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [createOpen, setCreateOpen] = useState(false)
  const [createFormKey, setCreateFormKey] = useState(0)
  const [editRow, setEditRow] = useState<AdminNewsRow | null>(null)
  const [viewRow, setViewRow] = useState<AdminNewsRow | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<AdminNewsRow | null>(null)
  const [removedIds, setRemovedIds] = useState(() => new Set<string>())
  const [localExtras, setLocalExtras] = useState<AdminNewsRow[]>([])
  const [rowPatches, setRowPatches] = useState<
    Record<string, Partial<AdminNewsRow>>
  >({})

  const query = useQuery({
    queryKey: ['admin-news'],
    queryFn: fetchAdminNews,
  })

  const baseRows = useMemo(() => {
    const data = [...(query.data ?? []), ...localExtras]
    return data
      .filter((row) => !removedIds.has(row.id))
      .map((row) => {
        const patch = rowPatches[row.id]
        return patch ? { ...row, ...patch } : row
      })
  }, [query.data, localExtras, removedIds, rowPatches])

  const nextRowNumber = useMemo(() => nextNewsNumber(baseRows), [baseRows])

  const filteredRows = useMemo(
    () => filterAdminNews(baseRows, search),
    [baseRows, search],
  )

  const totalPages = Math.max(
    1,
    Math.ceil(filteredRows.length / ADMIN_NEWS_PAGE_SIZE),
  )

  const safePage = Math.min(page, totalPages)

  const pageRows = useMemo(() => {
    const start = (safePage - 1) * ADMIN_NEWS_PAGE_SIZE
    return filteredRows.slice(start, start + ADMIN_NEWS_PAGE_SIZE)
  }, [filteredRows, safePage])

  const formLabels = useMemo(
    () => ({
      createTitle: t('admin.news.addModal.title'),
      editTitle: t('admin.news.editModal.title'),
      close: t('admin.news.addModal.close'),
      titleLabel: t('admin.news.addModal.titleLabel'),
      coverLabel: t('admin.news.addModal.coverLabel'),
      bodyLabel: t('admin.news.addModal.bodyLabel'),
      publishedLabel: t('admin.news.addModal.publishedLabel'),
      back: t('admin.news.addModal.back'),
      create: t('admin.news.addModal.create'),
      save: t('admin.news.editModal.save'),
      creating: t('admin.news.addModal.creating'),
      saving: t('admin.news.editModal.saving'),
      submitError: t('admin.news.addModal.submitError'),
      validationRequired: t('admin.news.addModal.validationRequired'),
    }),
    [t],
  )

  const viewLabels = useMemo(
    () => ({
      title: t('admin.news.viewModal.title'),
      close: t('admin.news.viewModal.close'),
      dismiss: t('admin.news.viewModal.dismiss'),
      headlineCaption: t('admin.news.viewModal.headlineCaption'),
      bodyCaption: t('admin.news.viewModal.bodyCaption'),
      statusCaption: t('admin.news.viewModal.statusCaption'),
      published: t('admin.news.statusPublished'),
      draft: t('admin.news.statusDraft'),
    }),
    [t],
  )

  const handleCreated = useCallback(
    (row: AdminNewsRow) => {
      setLocalExtras((prev) => [...prev, row])
      notifications.show({
        title: t('admin.news.createToastTitle'),
        message: t('admin.news.createToastMessage'),
        color: 'green',
      })
    },
    [t],
  )

  const handleUpdated = useCallback((row: AdminNewsRow) => {
    setRowPatches((prev) => ({
      ...prev,
      [row.id]: {
        ...prev[row.id],
        ...row,
      },
    }))
  }, [])

  const handleRequestDelete = useCallback((row: AdminNewsRow) => {
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
      title: t('admin.news.deleteToastTitle'),
      message: t('admin.news.deleteToastMessage'),
      color: 'green',
    })
  }, [deleteTarget, t])

  const columns: TableColumn<AdminNewsRow>[] = useMemo(
    () => [
      {
        key: 'number',
        header: headerLabel(t('admin.news.colNo')),
        width: 64,
        render: (row) => row.number,
      },
      {
        key: 'title',
        header: headerLabel(t('admin.news.colTitle')),
        width: '26%',
        render: (row) => <span className={nm.titleCell}>{row.title}</span>,
      },
      {
        key: 'cover',
        header: headerLabel(t('admin.news.colCover')),
        width: 120,
        cellClassName: cn.channelCell,
        render: (row) => (
          <img
            className={nm.thumb}
            src={row.coverImageUrl}
            alt=""
            loading="lazy"
            decoding="async"
          />
        ),
      },
      {
        key: 'created',
        header: headerLabel(t('admin.news.colCreated')),
        width: 148,
        render: (row) => row.createdAt,
      },
      {
        key: 'status',
        header: headerLabel(t('admin.news.colStatus')),
        width: 120,
        render: (row) => (
          <span
            className={
              row.status === 'published' ? nm.statusPublished : nm.statusDraft
            }
          >
            {row.status === 'published'
              ? t('admin.news.statusPublished')
              : t('admin.news.statusDraft')}
          </span>
        ),
      },
      {
        key: 'actions',
        header: headerLabel(t('admin.news.colActions')),
        width: 180,
        cellClassName: cn.actionsCell,
        render: (row): ReactNode => (
          <MemeTableRowActions
            className={cn.actionsToolbar}
            editLabel={t('admin.news.editAria')}
            viewLabel={t('admin.news.viewAria')}
            deleteLabel={t('admin.news.deleteAria')}
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
    return <AdminBloggersLoading title={t('admin.news.pageTitle')} />
  }

  if (query.isError) {
    return (
      <AdminBloggersState
        title={t('admin.news.pageTitle')}
        stateTitle={t('admin.news.errorTitle')}
        text={t('admin.news.errorText')}
        actionLabel={t('admin.news.retry')}
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
        <h1 className={cn.title}>{t('admin.news.pageTitle')}</h1>
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
              placeholder={t('admin.news.searchPlaceholder')}
              aria-label={t('admin.news.searchAria')}
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
            {t('admin.news.addNews')}
          </button>
        </div>
      </header>

      {baseRows.length === 0 ? (
        <AdminBloggersState
          embedded
          title={t('admin.news.pageTitle')}
          stateTitle={t('admin.news.emptyTitle')}
          text={t('admin.news.emptyText')}
          actionLabel={t('admin.news.retry')}
          image="/assets/empty-item.svg"
          onAction={() => {
            setRemovedIds(new Set())
            setLocalExtras([])
            setRowPatches({})
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
              emptyState={t('admin.news.noResults')}
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
              aria-label={t('admin.news.paginationAria')}
            />
          ) : null}
        </>
      )}

      <NewsFormModal
        key={`news-create-${createFormKey}`}
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

      <NewsFormModal
        key={editRow ? `news-edit-${editRow.id}` : 'news-edit-closed'}
        mode="edit"
        isOpen={editRow !== null}
        row={editRow}
        nextNumber={nextRowNumber}
        labels={formLabels}
        onClose={() => {
          setEditRow(null)
        }}
        onUpdated={(r) => {
          handleUpdated(r)
          notifications.show({
            title: t('admin.news.editToastTitle'),
            message: t('admin.news.editToastMessage'),
            color: 'green',
          })
        }}
      />

      <ViewNewsModal
        news={viewRow}
        isOpen={viewRow !== null}
        labels={viewLabels}
        onClose={() => {
          setViewRow(null)
        }}
      />

      <ConfirmModal
        cancelLabel={t('admin.news.deleteModal.cancel')}
        closeAriaLabel={t('admin.news.deleteModal.closeAria')}
        confirmLabel={t('admin.news.deleteModal.confirm')}
        confirmingLabel={t('admin.news.deleteModal.confirming')}
        isOpen={deleteTarget !== null}
        message={
          deleteTarget
            ? t('admin.news.deleteModal.message', {
                title: deleteTarget.title,
              })
            : ''
        }
        title={t('admin.news.deleteModal.title')}
        onCancel={() => {
          setDeleteTarget(null)
        }}
        onConfirm={handleConfirmDelete}
      />
    </section>
  )
}
