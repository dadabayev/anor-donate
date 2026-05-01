import cn from './admin-bloggers-page.module.css'

import {
  ADMIN_BLOGGERS_PAGE_SIZE,
  type AdminBloggerRow,
  fetchAdminBloggers,
} from '../model/admin-bloggers'
import { AdminBloggersLoading } from './components/admin-bloggers-loading'
import { AdminBloggersState } from './components/admin-bloggers-state'
import { EditUserModal } from './edit-user-modal'
import { ViewBloggerModal } from './view-blogger-modal'
import { Pagination } from '@mantine/core'
import { notifications } from '@mantine/notifications'
import {
  ConfirmModal,
  Table,
  type TableColumn,
  TableRowActions,
} from '@shared/ui'
import {
  IconAlertTriangle,
  IconArrowsUpDown,
  IconSearch,
} from '@tabler/icons-react'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import classNames from 'classnames'
import {
  type ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { useTranslation } from 'react-i18next'

const headerLabel = (label: string) => (
  <span className={cn.headerLabel}>
    <span>{label}</span>
    <IconArrowsUpDown size={14} stroke={1.8} />
  </span>
)

export const AdminBloggersPage = () => {
  const { t } = useTranslation()
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [viewRow, setViewRow] = useState<AdminBloggerRow | null>(null)
  const [editRow, setEditRow] = useState<AdminBloggerRow | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<AdminBloggerRow | null>(null)
  const [removedIds, setRemovedIds] = useState(() => new Set<string>())
  const [rowPatches, setRowPatches] = useState<
    Record<string, Partial<AdminBloggerRow>>
  >({})

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setDebouncedSearch(search)
    }, 400)

    return () => {
      window.clearTimeout(timeout)
    }
  }, [search])

  const query = useQuery({
    queryKey: ['admin-bloggers', page, debouncedSearch],
    queryFn: () =>
      fetchAdminBloggers({
        page: page - 1,
        size: ADMIN_BLOGGERS_PAGE_SIZE,
        name: debouncedSearch.trim(),
      }),
    placeholderData: keepPreviousData,
  })

  const baseRows = useMemo(() => {
    const data = query.data?.items ?? []
    return data
      .filter((row) => !removedIds.has(row.id))
      .map((row) => {
        const patch = rowPatches[row.id]
        return patch ? { ...row, ...patch } : row
      })
  }, [query.data?.items, removedIds, rowPatches])

  const handleRequestDelete = useCallback((row: AdminBloggerRow) => {
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
      title: t('admin.bloggers.deleteToastTitle'),
      message: t('admin.bloggers.deleteToastMessage'),
      color: 'green',
    })
  }, [deleteTarget, t])

  const viewLabels = useMemo(
    () => ({
      title: t('admin.bloggers.viewModal.title'),
      close: t('admin.bloggers.viewModal.close'),
      firstName: t('admin.bloggers.viewModal.firstName'),
      username: t('admin.bloggers.viewModal.username'),
      channelName: t('admin.bloggers.viewModal.channelName'),
      channelUrl: t('admin.bloggers.viewModal.channelUrl'),
      email: t('admin.bloggers.viewModal.email'),
      channelAbout: t('admin.bloggers.viewModal.channelAbout'),
      password: t('admin.bloggers.viewModal.password'),
      back: t('admin.bloggers.viewModal.back'),
    }),
    [t],
  )

  const editLabels = useMemo(
    () => ({
      title: t('admin.bloggers.editModal.title'),
      close: t('admin.bloggers.editModal.close'),
      save: t('admin.bloggers.editModal.save'),
      firstName: t('admin.bloggers.viewModal.firstName'),
      username: t('admin.bloggers.viewModal.username'),
      channelName: t('admin.bloggers.viewModal.channelName'),
      channelUrl: t('admin.bloggers.viewModal.channelUrl'),
      email: t('admin.bloggers.viewModal.email'),
      channelAbout: t('admin.bloggers.viewModal.channelAbout'),
      password: t('admin.bloggers.viewModal.password'),
    }),
    [t],
  )

  const handleSaveEdit = useCallback(
    (updated: AdminBloggerRow) => {
      setRowPatches((prev) => ({
        ...prev,
        [updated.id]: {
          ...prev[updated.id],
          fullName: updated.fullName,
          username: updated.username,
          nickname: updated.nickname,
          channelName: updated.channelName,
          channelUrl: updated.channelUrl,
          channel: updated.channel,
          email: updated.email,
          channelAbout: updated.channelAbout,
          passwordDisplay: updated.passwordDisplay,
        },
      }))
      setEditRow(null)
      notifications.show({
        title: t('admin.bloggers.editModal.successTitle'),
        message: t('admin.bloggers.editModal.successMessage'),
        color: 'green',
      })
    },
    [t],
  )

  const columns: TableColumn<AdminBloggerRow>[] = useMemo(
    () => [
      {
        key: 'number',
        header: headerLabel(t('admin.bloggers.colNo')),
        width: 72,
        render: (row) => row.number,
      },
      {
        key: 'nickname',
        header: headerLabel(t('admin.bloggers.colNickname')),
        width: '14%',
        render: (row) => row.nickname,
      },
      {
        key: 'fullName',
        header: headerLabel(t('admin.bloggers.colFullName')),
        width: '16%',
        render: (row) => row.fullName,
      },
      {
        key: 'channel',
        header: headerLabel(t('admin.bloggers.colChannel')),
        width: '22%',
        cellClassName: cn.channelCell,
        render: (row) => <span title={row.channel}>{row.channel}</span>,
      },
      {
        key: 'phone',
        header: headerLabel(t('admin.bloggers.colPhone')),
        width: 132,
        cellClassName: cn.phoneCell,
        render: (row) => row.phone,
      },
      {
        key: 'status',
        header: headerLabel(t('admin.bloggers.colStatus')),
        width: 108,
        render: (row) => (
          <span
            className={classNames(
              cn.status,
              row.status === 'active' ? cn.statusActive : cn.statusBlocked,
            )}
          >
            {row.status === 'active'
              ? t('admin.bloggers.statusActive')
              : t('admin.bloggers.statusBlocked')}
          </span>
        ),
      },
      {
        key: 'actions',
        header: headerLabel(t('admin.bloggers.colActions')),
        width: 168,
        cellClassName: cn.actionsCell,
        render: (row): ReactNode => (
          <TableRowActions
            className={cn.actionsToolbar}
            deleteLabel={t('admin.bloggers.deleteAria')}
            editLabel={t('admin.bloggers.editAria')}
            viewLabel={t('admin.bloggers.viewAria')}
            onDelete={() => {
              handleRequestDelete(row)
            }}
            onEdit={() => {
              setEditRow(row)
            }}
            onView={() => {
              setViewRow(row)
            }}
          />
        ),
      },
    ],
    [handleRequestDelete, t],
  )

  if (query.isLoading) {
    return <AdminBloggersLoading title={t('admin.bloggers.pageTitle')} />
  }

  if (query.isError) {
    return (
      <AdminBloggersState
        title={t('admin.bloggers.pageTitle')}
        stateTitle={t('admin.bloggers.errorTitle')}
        text={t('admin.bloggers.errorText')}
        actionLabel={t('admin.bloggers.retry')}
        icon={<IconAlertTriangle size={44} stroke={1.8} color="#b42318" />}
        onAction={() => {
          void query.refetch()
        }}
      />
    )
  }

  if (baseRows.length === 0 && !query.isFetching) {
    return (
      <AdminBloggersState
        title={t('admin.bloggers.pageTitle')}
        stateTitle={t('admin.bloggers.emptyTitle')}
        text={t('admin.bloggers.emptyText')}
        actionLabel={t('admin.bloggers.retry')}
        image="/assets/empty-item.svg"
        onAction={() => {
          setRemovedIds(new Set())
          void query.refetch()
        }}
      />
    )
  }

  return (
    <section className={cn.page}>
      <header className={cn.headerBlock}>
        <h1 className={cn.title}>{t('admin.bloggers.pageTitle')}</h1>
        <div className={cn.searchWrap}>
          <input
            className={cn.searchInput}
            type="search"
            value={search}
            onChange={(event) => {
              setSearch(event.target.value)
              setPage(1)
            }}
            placeholder={t('admin.bloggers.searchPlaceholder')}
            aria-label={t('admin.bloggers.searchAria')}
          />
          <IconSearch className={cn.searchIcon} size={22} stroke={1.8} />
        </div>
      </header>

      <section
        className={classNames(
          cn.tableWrap,
          query.isFetching && cn.tableWrapBusy,
        )}
      >
        <Table
          variant="history"
          columns={columns}
          rows={baseRows}
          getRowKey={(row) => row.id}
          emptyState={t('admin.bloggers.noResults')}
        />
      </section>

      {(query.data?.totalPages ?? 0) > 0 ? (
        <Pagination
          classNames={{
            root: cn.pagination,
            control: cn.paginationControl,
            dots: cn.paginationDots,
          }}
          total={Math.max(1, query.data?.totalPages ?? 1)}
          value={page}
          onChange={setPage}
          siblings={1}
          boundaries={1}
          gap="9px"
          aria-label={t('admin.bloggers.paginationAria')}
        />
      ) : null}

      <ViewBloggerModal
        blogger={viewRow}
        labels={viewLabels}
        onClose={() => {
          setViewRow(null)
        }}
      />

      <EditUserModal
        user={editRow}
        labels={editLabels}
        onClose={() => {
          setEditRow(null)
        }}
        onSave={handleSaveEdit}
      />

      <ConfirmModal
        cancelLabel={t('admin.bloggers.deleteModal.cancel')}
        closeAriaLabel={t('admin.bloggers.deleteModal.closeAria')}
        confirmLabel={t('admin.bloggers.deleteModal.confirm')}
        confirmingLabel={t('admin.bloggers.deleteModal.confirming')}
        isOpen={deleteTarget !== null}
        message={
          deleteTarget
            ? t('admin.bloggers.deleteModal.message', {
                name: deleteTarget.fullName,
              })
            : ''
        }
        title={t('admin.bloggers.deleteModal.title')}
        onCancel={() => {
          setDeleteTarget(null)
        }}
        onConfirm={handleConfirmDelete}
      />
    </section>
  )
}
