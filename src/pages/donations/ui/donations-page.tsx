import cn from './donations-page.module.css'

import {
  type DonationHistoryRow,
  DONATIONS_MODE_KEY,
  readDonationHistory,
} from '../model/donations'
import { DonationsLoading, DonationsState } from './components'
import { Pagination } from '@mantine/core'
import { Table, type TableColumn } from '@shared/ui'
import { IconAlertTriangle, IconArrowsUpDown } from '@tabler/icons-react'
import { useQuery } from '@tanstack/react-query'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

const headerLabel = (label: string) => (
  <span className={cn.headerLabel}>
    <span>{label}</span>
    <IconArrowsUpDown size={14} stroke={1.8} />
  </span>
)

const TOTAL_PAGES = 33

const loadDonationHistory = async (): Promise<DonationHistoryRow[]> => {
  await new Promise((resolve) => window.setTimeout(resolve, 350))
  return readDonationHistory()
}

export const DonationsPage = () => {
  const { t } = useTranslation()
  const [page, setPage] = useState(1)
  const query = useQuery({
    queryKey: ['donations-history'],
    queryFn: loadDonationHistory,
  })

  const columns: TableColumn<DonationHistoryRow>[] = useMemo(
    () => [
      {
        key: 'number',
        header: headerLabel(t('donationsPage.colNo')),
        render: (row) => row.number,
      },
      {
        key: 'name',
        header: headerLabel(t('donationsPage.colName')),
        render: (row) => row.name,
      },
      {
        key: 'paymentAmount',
        header: headerLabel(t('donationsPage.colPaymentAmount')),
        render: (row) => row.paymentAmount,
      },
      {
        key: 'commission',
        header: headerLabel(t('donationsPage.colCommission')),
        render: (row) => row.commission,
      },
      {
        key: 'paymentTime',
        header: headerLabel(t('donationsPage.colPaymentTime')),
        render: (row) => (
          <strong className={cn.timeValue}>{row.paymentTime}</strong>
        ),
      },
    ],
    [t],
  )

  if (query.isLoading) {
    return <DonationsLoading title={t('donationsPage.pageTitle')} />
  }

  if (query.isError) {
    return (
      <DonationsState
        title={t('donationsPage.pageTitle')}
        stateTitle={t('donationsPage.errorTitle')}
        text={t('donationsPage.errorText')}
        actionLabel={t('donationsPage.retry')}
        onAction={() => {
          window.localStorage.removeItem(DONATIONS_MODE_KEY)
          void query.refetch()
        }}
        icon={<IconAlertTriangle size={44} stroke={1.8} color="#b42318" />}
      />
    )
  }

  if ((query.data?.length ?? 0) === 0) {
    return (
      <DonationsState
        title={t('donationsPage.pageTitle')}
        stateTitle={t('donationsPage.emptyTitle')}
        text={t('donationsPage.emptyHint')}
        actionLabel={t('donationsPage.retry')}
        onAction={() => {
          window.localStorage.removeItem(DONATIONS_MODE_KEY)
          void query.refetch()
        }}
        image="/assets/empty-item.svg"
      />
    )
  }

  return (
    <section className={cn.page}>
      <header className={cn.header}>
        <h1 className={cn.title}>{t('donationsPage.pageTitle')}</h1>
      </header>

      <section className={cn.tableWrap}>
        <Table
          variant="history"
          columns={columns}
          rows={query.data ?? []}
          getRowKey={(row) => row.id}
          emptyState={t('donationsPage.emptyText')}
        />
      </section>

      <Pagination
        classNames={{
          root: cn.pagination,
          control: cn.paginationControl,
          dots: cn.paginationDots,
        }}
        total={TOTAL_PAGES}
        value={page}
        onChange={setPage}
        siblings={1}
        boundaries={1}
        gap="9px"
        aria-label={t('donationsPage.paginationAria')}
      />
    </section>
  )
}
