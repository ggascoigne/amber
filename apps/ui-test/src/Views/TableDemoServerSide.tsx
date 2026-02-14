import { useCallback, useState } from 'react'

import { Table } from '@amber/ui/components/Table'
import Box from '@mui/material/Box'
import { createColumnHelper } from '@tanstack/react-table'
import type { Row, TableState } from '@tanstack/react-table'

import { Page } from '@/Components'
import type { UserType } from '@/utils/queries'
import { useUsersQuery } from '@/utils/queries'

const columnHelper = createColumnHelper<UserType>()

const columns = [
  columnHelper.accessor('firstName', {
    enableColumnFilter: true,
  }),
  columnHelper.accessor('lastName', {
    enableColumnFilter: true,
  }),
  columnHelper.accessor('fullName', {
    enableColumnFilter: true,
  }),
  columnHelper.accessor('email', {}),
  columnHelper.accessor('address', {}),
  columnHelper.accessor('city', {}),
  columnHelper.accessor('state', {}),
  columnHelper.accessor('zipCode', {}),
  columnHelper.accessor('phone', {}),
  columnHelper.accessor('gender', {}),
  columnHelper.accessor('subscriptionTier', {
    header: 'Subscription',
    enableColumnFilter: true,
  }),
]
export const TableDemoServerSide = () => {
  const [state, setState] = useState<Partial<TableState> | undefined>(undefined)
  const handleStateChange = useCallback((newState: TableState) => {
    setState({
      pagination: newState?.pagination,
      sorting: newState?.sorting ?? [],
      globalFilter: newState?.globalFilter,
      columnFilters: newState?.columnFilters,
    })
  }, [])

  const { data, isLoading, isFetching, refetch } = useUsersQuery(
    {
      pageIndex: state?.pagination?.pageIndex ?? 0,
      pageSize: state?.pagination?.pageSize ?? 10,
      sorting: state?.sorting ?? [],
      globalFilter: state?.globalFilter ?? '',
      filters: state?.columnFilters,
    },
    { enabled: !!state },
  )

  const dummy = useCallback((instance: any, selectedKeys: string[]) => {
    console.log('Toolbar Action Clicked', instance, selectedKeys)
  }, [])

  const onRowClick = useCallback((row: Row<UserType>) => {
    console.log(row)
  }, [])

  return (
    <Page>
      <Box
        sx={[
          {
            p: 2,
            display: 'flex',
            flexDirection: 'column',
            flex: '1 1 auto',
            minHeight: 0,
            height: '600px',
          },
        ]}
      >
        <Table
          title='Table - Server search'
          name='table-test-server'
          keyField='id'
          columns={columns}
          data={data?.rows ?? []}
          isLoading={isLoading}
          isFetching={isFetching}
          onAdd={dummy}
          onEdit={dummy}
          onDelete={dummy}
          onRowClick={onRowClick}
          scrollBehavior='bounded'
          refetch={refetch}
          debug
          handleStateChange={handleStateChange}
          rowCount={data?.rowCount ?? 0}
          displayGutter={false}
        />
      </Box>
    </Page>
  )
}
