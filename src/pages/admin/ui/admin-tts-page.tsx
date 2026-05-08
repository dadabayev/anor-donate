import cn from './admin-bloggers-page.module.css'
import sm from './admin-tts-page.module.css'

import type { AdminTtsWordRow } from '../model/admin-tts-words'
import {
  ADMIN_TTS_PAGE_SIZE,
  fetchAdminTtsWords,
  filterTtsWords,
  nextTtsWordNumber,
} from '../model/admin-tts-words'
import { AddTtsWordModal } from './add-tts-word-modal'
import { AdminBloggersLoading } from './components/admin-bloggers-loading'
import { AdminBloggersState } from './components/admin-bloggers-state'
import { Pagination } from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { ConfirmModal, Table, type TableColumn } from '@shared/ui'
import {
  IconAlertTriangle,
  IconArrowsUpDown,
  IconSearch,
  IconTrash,
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

export const AdminTtsPage = () => {
  const { t } = useTranslation()
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [addOpen, setAddOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<AdminTtsWordRow | null>(null)
  const [removedIds, setRemovedIds] = useState(() => new Set<string>())
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: ['admin-tts-words'],
    queryFn: fetchAdminTtsWords,
  })

  const baseRows = useMemo(() => {
    const data = query.data ?? []
    return data.filter((row) => !removedIds.has(row.id))
  }, [query.data, removedIds])

  const nextRowNumber = useMemo(() => nextTtsWordNumber(baseRows), [baseRows])

  const filteredRows = useMemo(
    () => filterTtsWords(baseRows, search),
    [baseRows, search],
  )

  const totalPages = Math.max(
    1,
    Math.ceil(filteredRows.length / ADMIN_TTS_PAGE_SIZE),
  )

  const safePage = Math.min(page, totalPages)

  const pageRows = useMemo(() => {
    const start = (safePage - 1) * ADMIN_TTS_PAGE_SIZE
    return filteredRows.slice(start, start + ADMIN_TTS_PAGE_SIZE)
  }, [filteredRows, safePage])

  const onCreatedFromModal = useCallback(() => {
    void queryClient.invalidateQueries({ queryKey: ['admin-tts-words'] })
    notifications.show({
      title: t('admin.tts.createToastTitle'),
      message: t('admin.tts.createToastMessage'),
      color: 'green',
    })
  }, [queryClient, t])

  const handleRequestDelete = useCallback((row: AdminTtsWordRow) => {
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
      title: t('admin.tts.deleteToastTitle'),
      message: t('admin.tts.deleteToastMessage'),
      color: 'green',
    })
  }, [deleteTarget, t])

  const addModalLabels = useMemo(
    () => ({
      title: t('admin.tts.addModal.title'),
      close: t('admin.tts.addModal.close'),
      fromLabel: t('admin.tts.colFrom'),
      toLabel: t('admin.tts.colTo'),
      standardFilterLabel: t('admin.tts.addModal.standardFilter'),
      back: t('admin.tts.addModal.back'),
      create: t('admin.tts.addModal.create'),
      creating: t('admin.tts.addModal.creating'),
      submitError: t('admin.tts.addModal.submitError'),
      validationRequired: t('admin.tts.addModal.validationRequired'),
    }),
    [t],
  )

  const columns: TableColumn<AdminTtsWordRow>[] = useMemo(
    () => [
      {
        key: 'number',
        header: headerLabel(t('admin.tts.colNo')),
        width: 72,
        render: (row) => row.number,
      },
      {
        key: 'from',
        header: headerLabel(t('admin.tts.colFrom')),
        width: '18%',
        render: (row) => row.fromWord,
      },
      {
        key: 'to',
        header: headerLabel(t('admin.tts.colTo')),
        width: '18%',
        render: (row) => row.toWord,
      },
      {
        key: 'standard',
        header: headerLabel(t('admin.tts.colStandardFilter')),
        width: '14%',
        render: (row) => (
          <span className={row.isStandardFilter ? sm.statusYes : sm.statusNo}>
            {row.isStandardFilter
              ? t('admin.tts.standardYes')
              : t('admin.tts.standardNo')}
          </span>
        ),
      },
      {
        key: 'created',
        header: headerLabel(t('admin.tts.colCreated')),
        width: '18%',
        render: (row) => row.createdAt,
      },
      {
        key: 'actions',
        header: headerLabel(t('admin.tts.colActions')),
        width: 100,
        cellClassName: cn.actionsCell,
        render: (row): ReactNode => (
          <button
            type="button"
            className={sm.deleteBtn}
            aria-label={t('admin.tts.deleteAria')}
            onClick={() => {
              handleRequestDelete(row)
            }}
          >
            <IconTrash size={18} stroke={2} />
          </button>
        ),
      },
    ],
    [handleRequestDelete, t],
  )

  if (query.isLoading) {
    return <AdminBloggersLoading title={t('admin.tts.pageTitle')} />
  }

  if (query.isError) {
    return (
      <AdminBloggersState
        title={t('admin.tts.pageTitle')}
        stateTitle={t('admin.tts.errorTitle')}
        text={t('admin.tts.errorText')}
        actionLabel={t('admin.tts.retry')}
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
        <h1 className={cn.title}>{t('admin.tts.pageTitle')}</h1>
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
              placeholder={t('admin.tts.searchPlaceholder')}
              aria-label={t('admin.tts.searchAria')}
            />
            <IconSearch className={cn.searchIcon} size={22} stroke={1.8} />
          </div>
          <button
            type="button"
            className={sm.addButton}
            onClick={() => {
              setAddOpen(true)
            }}
          >
            {t('admin.tts.addWord')}
          </button>
        </div>
      </header>

      {baseRows.length === 0 ? (
        <AdminBloggersState
          embedded
          title={t('admin.tts.pageTitle')}
          stateTitle={t('admin.tts.emptyTitle')}
          text={t('admin.tts.emptyText')}
          actionLabel={t('admin.tts.retry')}
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
              emptyState={t('admin.tts.noResults')}
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
              aria-label={t('admin.tts.paginationAria')}
            />
          ) : null}
        </>
      )}

      <AddTtsWordModal
        isOpen={addOpen}
        nextRowNumber={nextRowNumber}
        labels={addModalLabels}
        onClose={() => {
          setAddOpen(false)
        }}
        onCreated={onCreatedFromModal}
      />

      <ConfirmModal
        cancelLabel={t('admin.tts.deleteModal.cancel')}
        closeAriaLabel={t('admin.tts.deleteModal.closeAria')}
        confirmLabel={t('admin.tts.deleteModal.confirm')}
        confirmingLabel={t('admin.tts.deleteModal.confirming')}
        isOpen={deleteTarget !== null}
        message={
          deleteTarget
            ? t('admin.tts.deleteModal.message', {
                from: deleteTarget.fromWord,
                to: deleteTarget.toWord,
              })
            : ''
        }
        title={t('admin.tts.deleteModal.title')}
        onCancel={() => {
          setDeleteTarget(null)
        }}
        onConfirm={handleConfirmDelete}
      />
    </section>
  )
}
