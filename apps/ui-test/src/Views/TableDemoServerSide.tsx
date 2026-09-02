import { useCallback } from 'react'

import { getDefaultSort, Table, useServerTableState } from '@amber/ui/components/Table'
import { createColumnHelper } from '@amber/ui/components/Table/tableTypes'
import type { Row } from '@amber/ui/components/Table/tableTypes'
import Box from '@mui/material/Box'

import { Page } from '@/Components'
import type { UserType } from '@/utils/queries'
import { useUsersQuery } from '@/utils/queries'

const columnHelper = createColumnHelper<UserType>()

const columns = columnHelper.columns([
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
])
export const TableDemoServerSide = () => {
  const { atoms, initialState, state } = useServerTableState({
    initialState: { sorting: getDefaultSort(columns) },
  })

  const { data, isLoading, isFetching, refetch } = useUsersQuery({
    pageIndex: state.pagination.pageIndex,
    pageSize: state.pagination.pageSize,
    sorting: state.sorting,
    globalFilter: state.globalFilter ?? '',
    filters: state.columnFilters,
  })

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
          disableStatePersistence
          atoms={atoms}
          initialState={initialState}
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
          rowCount={data?.rowCount ?? 0}
          displayGutter={false}
        />
      </Box>
    </Page>
  )
}
