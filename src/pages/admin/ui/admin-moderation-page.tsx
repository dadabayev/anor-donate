import cn from './admin-bloggers-page.module.css'
import sm from './admin-moderation-page.module.css'

import {
  ADMIN_MODERATION_PAGE_SIZE,
  type AdminModerationRow,
  fetchAdminModeration,
  filterModerationRows,
} from '../model/admin-moderation'
import { verifyAdminUser } from '../model/admin-bloggers'
import { AdminBloggersLoading } from './components/admin-bloggers-loading'
import { AdminBloggersState } from './components/admin-bloggers-state'
import { ModerationRowActions } from './components/moderation-row-actions'
import { ViewBloggerModal } from './view-blogger-modal'
import { Pagination } from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { Table, type TableColumn } from '@shared/ui'
import {
  IconAlertTriangle,
  IconArrowsUpDown,
  IconSearch,
} from '@tabler/icons-react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { type ReactNode, useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

const headerLabel = (label: string) => (
  <span className={cn.headerLabel}>
    <span>{label}</span>
    <IconArrowsUpDown size={14} stroke={1.8} />
  </span>
)

export const AdminModerationPage = () => {
  const { t } = useTranslation()
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [viewRow, setViewRow] = useState<AdminModerationRow | null>(null)
  const [removedIds, setRemovedIds] = useState(() => new Set<string>())

  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: ['admin-moderation'],
    queryFn: fetchAdminModeration,
  })

  const verifyMutation = useMutation({
    mutationFn: verifyAdminUser,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['admin-moderation'] })
      notifications.show({
        title: t('admin.moderation.approveToastTitle'),
        message: t('admin.moderation.approveToastMessage'),
        color: 'green',
      })
    },
    onError: () => {
      notifications.show({
        title: t('admin.moderation.errorTitle'),
        message: t('admin.moderation.errorText'),
        color: 'red',
      })
    },
  })

  const baseRows = useMemo(() => {
    const data = query.data ?? []
    return data.filter((row) => !removedIds.has(row.id))
  }, [query.data, removedIds])

  const filteredRows = useMemo(
    () => filterModerationRows(baseRows, search),
    [baseRows, search],
  )

  const totalPages = Math.max(
    1,
    Math.ceil(filteredRows.length / ADMIN_MODERATION_PAGE_SIZE),
  )

  const safePage = Math.min(page, totalPages)

  const pageRows = useMemo(() => {
    const start = (safePage - 1) * ADMIN_MODERATION_PAGE_SIZE
    return filteredRows.slice(start, start + ADMIN_MODERATION_PAGE_SIZE)
  }, [filteredRows, safePage])

  const handleApprove = useCallback(
    (row: AdminModerationRow) => {
      verifyMutation.mutate(row.id)
    },
    [verifyMutation],
  )

  const handleReject = useCallback(
    (row: AdminModerationRow) => {
      setRemovedIds((prev) => new Set(prev).add(row.id))
      notifications.show({
        title: t('admin.moderation.rejectToastTitle'),
        message: t('admin.moderation.rejectToastMessage'),
        color: 'orange',
      })
    },
    [t],
  )

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

  const columns: TableColumn<AdminModerationRow>[] = useMemo(
    () => [
      {
        key: 'number',
        header: headerLabel(t('admin.moderation.colNo')),
        width: 72,
        render: (row) => row.number,
      },
      {
        key: 'nickname',
        header: headerLabel(t('admin.moderation.colNickname')),
        width: '12%',
        render: (row) => row.nickname,
      },
      {
        key: 'fullName',
        header: headerLabel(t('admin.moderation.colFullName')),
        width: '14%',
        render: (row) => row.fullName,
      },
      {
        key: 'channel',
        header: headerLabel(t('admin.moderation.colChannel')),
        width: '18%',
        cellClassName: cn.channelCell,
        render: (row) => <span title={row.channel}>{row.channel}</span>,
      },
      {
        key: 'thumb',
        header: headerLabel(t('admin.moderation.colPreview')),
        width: 88,
        cellClassName: sm.thumbCell,
        render: (row) => (
          <div className={sm.thumbWrap}>
            {row.channelThumbUrl ? (
              <img
                className={sm.thumb}
                src={row.channelThumbUrl}
                alt=""
                loading="lazy"
                decoding="async"
              />
            ) : (
              <span className={sm.thumbFallback} aria-hidden="true">
                {row.nickname.slice(0, 1).toUpperCase()}
              </span>
            )}
          </div>
        ),
      },
      {
        key: 'phone',
        header: headerLabel(t('admin.moderation.colPhone')),
        width: 148,
        cellClassName: cn.phoneCell,
        render: (row) => row.phone,
      },
      {
        key: 'actions',
        header: headerLabel(t('admin.moderation.colActions')),
        width: 168,
        cellClassName: cn.actionsCell,
        render: (row): ReactNode => (
          <ModerationRowActions
            className={cn.actionsToolbar}
            approveLabel={t('admin.moderation.approveAria')}
            rejectLabel={t('admin.moderation.rejectAria')}
            viewLabel={t('admin.moderation.viewAria')}
            onApprove={() => {
              handleApprove(row)
            }}
            onReject={() => {
              handleReject(row)
            }}
            onView={() => {
              setViewRow(row)
            }}
          />
        ),
      },
    ],
    [handleApprove, handleReject, t],
  )

  if (query.isLoading) {
    return <AdminBloggersLoading title={t('admin.moderation.pageTitle')} />
  }

  if (query.isError) {
    return (
      <AdminBloggersState
        title={t('admin.moderation.pageTitle')}
        stateTitle={t('admin.moderation.errorTitle')}
        text={t('admin.moderation.errorText')}
        actionLabel={t('admin.moderation.retry')}
        icon={<IconAlertTriangle size={44} stroke={1.8} color="#b42318" />}
        onAction={() => {
          void query.refetch()
        }}
      />
    )
  }

  if (baseRows.length === 0) {
    return (
      <AdminBloggersState
        title={t('admin.moderation.pageTitle')}
        stateTitle={t('admin.moderation.emptyTitle')}
        text={t('admin.moderation.emptyText')}
        actionLabel={t('admin.moderation.retry')}
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
        <h1 className={cn.title}>{t('admin.moderation.pageTitle')}</h1>
        <div className={cn.searchWrap}>
          <input
            className={cn.searchInput}
            type="search"
            value={search}
            onChange={(event) => {
              setSearch(event.target.value)
              setPage(1)
            }}
            placeholder={t('admin.moderation.searchPlaceholder')}
            aria-label={t('admin.moderation.searchAria')}
          />
          <IconSearch className={cn.searchIcon} size={22} stroke={1.8} />
        </div>
      </header>

      <section className={cn.tableWrap}>
        <Table
          variant="history"
          columns={columns}
          rows={pageRows}
          getRowKey={(row) => row.id}
          emptyState={t('admin.moderation.noResults')}
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
          aria-label={t('admin.moderation.paginationAria')}
        />
      ) : null}

      <ViewBloggerModal
        blogger={viewRow}
        labels={viewLabels}
        onClose={() => {
          setViewRow(null)
        }}
      />
    </section>
  )
}
