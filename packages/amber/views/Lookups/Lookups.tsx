import React from 'react'

import type { Lookup } from '@amber/client'
import { useInvalidateLookupQueries, useTRPC } from '@amber/client'
import { Table } from '@amber/ui/components/Table'
import { useMutation, useQuery } from '@tanstack/react-query'
import type { ColumnDef } from '@tanstack/react-table'

import { LookupsDialog } from './LookupsDialog'

import { Page } from '../../components'
import { TransportError } from '../../components/TransportError'
import { useStandardHandlers } from '../../utils/useStandardHandlers'

const columns: ColumnDef<Lookup>[] = [
  {
    accessorKey: 'realm',
  },
]

const Lookups = React.memo(() => {
  const trpc = useTRPC()

  const deleteLookupValue = useMutation(trpc.lookups.deleteLookupValue.mutationOptions())
  const deleteLookup = useMutation(trpc.lookups.deleteLookup.mutationOptions())
  const invalidateLookupQueries = useInvalidateLookupQueries()

  const { isLoading, isFetching, error, data = [], refetch } = useQuery(trpc.lookups.getLookups.queryOptions())

  const { showEdit, selection, handleCloseEdit, onAdd, onEdit, onRowClick, onDelete } = useStandardHandlers<Lookup>({
    deleteHandler: (selectedRows) =>
      selectedRows
        .map((lookup) =>
          lookup.lookupValue.reduce<Promise<unknown>[]>((acc, current) => {
            if (current?.id) {
              acc.push(deleteLookupValue.mutateAsync({ id: current.id }))
            }
            return acc
          }, []),
        )
        .flat()
        .concat(selectedRows.map((r) => deleteLookup.mutateAsync({ id: r.id }))),
    invalidateQueries: invalidateLookupQueries,
  })

  if (error) {
    return <TransportError error={error} />
  }

  return (
    <Page title='Lookups' variant='fill' hideTitle>
      {showEdit && <LookupsDialog open={showEdit} onClose={handleCloseEdit} initialValues={selection[0]} />}
      <Table<Lookup>
        title='Lookups'
        name='lookups'
        data={data}
        columns={columns}
        isLoading={isLoading}
        isFetching={isFetching}
        onRowClick={onRowClick}
        onAdd={onAdd}
        onEdit={onEdit}
        onDelete={onDelete}
        refetch={refetch}
        enableColumnFilters={false}
        enableGrouping={false}
      />
    </Page>
  )
})

export default Lookups
