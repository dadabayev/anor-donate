import cn from './donations-page.module.css'

import {
  DONATION_HISTORY_EMPTY_HINT,
  DONATION_HISTORY_EMPTY_TEXT,
  DONATION_HISTORY_EMPTY_TITLE,
  DONATION_HISTORY_ERROR_TEXT,
  DONATION_HISTORY_ERROR_TITLE,
  DONATION_HISTORY_RETRY_LABEL,
  type DonationHistoryRow,
  DONATIONS_MODE_KEY,
  DONATIONS_PAGE_TITLE,
  readDonationHistory,
} from '../model/donations'
import { DonationsLoading, DonationsState } from './components'
import { Pagination } from '@mantine/core'
import { Table, type TableColumn } from '@shared/ui'
import { IconAlertTriangle, IconArrowsUpDown } from '@tabler/icons-react'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'

const headerLabel = (label: string) => (
  <span className={cn.headerLabel}>
    <span>{label}</span>
    <IconArrowsUpDown size={14} stroke={1.8} />
  </span>
)

const columns: TableColumn<DonationHistoryRow>[] = [
  {
    key: 'number',
    header: headerLabel('No'),
    render: (row) => row.number,
  },
  {
    key: 'name',
    header: headerLabel('Ism'),
    render: (row) => row.name,
  },
  {
    key: 'paymentAmount',
    header: headerLabel("To'lov Summasi"),
    render: (row) => row.paymentAmount,
  },
  {
    key: 'commission',
    header: headerLabel('Komissiya'),
    render: (row) => row.commission,
  },
  {
    key: 'paymentTime',
    header: headerLabel("To'lov Vaqti"),
    render: (row) => (
      <strong className={cn.timeValue}>{row.paymentTime}</strong>
    ),
  },
]

const TOTAL_PAGES = 33

const loadDonationHistory = async (): Promise<DonationHistoryRow[]> => {
  await new Promise((resolve) => window.setTimeout(resolve, 350))
  return readDonationHistory()
}

export const DonationsPage = () => {
  const [page, setPage] = useState(1)
  const query = useQuery({
    queryKey: ['donations-history'],
    queryFn: loadDonationHistory,
  })

  if (query.isLoading) {
    return <DonationsLoading title={DONATIONS_PAGE_TITLE} />
  }

  if (query.isError) {
    return (
      <DonationsState
        title={DONATIONS_PAGE_TITLE}
        stateTitle={DONATION_HISTORY_ERROR_TITLE}
        text={DONATION_HISTORY_ERROR_TEXT}
        actionLabel={DONATION_HISTORY_RETRY_LABEL}
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
        title={DONATIONS_PAGE_TITLE}
        stateTitle={DONATION_HISTORY_EMPTY_TITLE}
        text={DONATION_HISTORY_EMPTY_HINT}
        actionLabel={DONATION_HISTORY_RETRY_LABEL}
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
        <h1 className={cn.title}>{DONATIONS_PAGE_TITLE}</h1>
      </header>

      <section className={cn.tableWrap}>
        <Table
          variant="history"
          columns={columns}
          rows={query.data ?? []}
          getRowKey={(row) => row.id}
          emptyState={DONATION_HISTORY_EMPTY_TEXT}
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
        aria-label="Donation history pagination"
      />
    </section>
  )
}
