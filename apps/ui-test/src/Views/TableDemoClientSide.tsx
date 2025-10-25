import { useCallback } from 'react'

import { Table } from '@amber/ui/components/Table'
import Box from '@mui/material/Box'
import { createColumnHelper } from '@tanstack/react-table'
import type { Row } from '@tanstack/react-table'

import { Page } from '@/Components'
import type { UserType } from '@/utils/queries'
import { useAllUsersQuery } from '@/utils/queries'

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
export const TableDemoClientSide = () => {
  const { data, isLoading, isFetching, refetch } = useAllUsersQuery()

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
          title='Table - Client search'
          name='table-test-client'
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
          displayGutter={false}
        />
      </Box>
    </Page>
  )
}
