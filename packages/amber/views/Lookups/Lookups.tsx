import React, { MouseEventHandler, useMemo, useState } from 'react'

import type { Lookup } from '@amber/client'
import { useInvalidateLookupQueries, useTRPC } from '@amber/client'
import { Loader, notEmpty, Page, Table } from '@amber/ui'
import { useMutation, useQuery } from '@tanstack/react-query'
import type { Column, Row, TableInstance } from 'react-table'

import { LookupsDialog } from './LookupsDialog'

import { TransportError } from '../../components/TransportError'
import type { TableMouseEventHandler } from '../../types/react-table-config'

const columns: Column<Lookup>[] = [
  {
    accessor: 'realm',
  },
]

const Lookups = React.memo(() => {
  const [showEdit, setShowEdit] = useState(false)
  const [selection, setSelection] = useState<Lookup[]>([])
  const trpc = useTRPC()

  const deleteLookupValue = useMutation(trpc.lookups.deleteLookupValue.mutationOptions())
  const deleteLookup = useMutation(trpc.lookups.deleteLookup.mutationOptions())
  const invalidateQueries = useInvalidateLookupQueries()

  const { isLoading, error, data, refetch } = useQuery(trpc.lookups.getLookups.queryOptions())
  const list = useMemo(() => data?.filter(notEmpty), [data])

  if (error) {
    return <TransportError error={error} />
  }
  if (isLoading || !list) {
    return <Loader />
  }
  const onAdd: TableMouseEventHandler<Lookup> = () => () => {
    setShowEdit(true)
  }

  const onCloseEdit: MouseEventHandler = () => {
    setShowEdit(false)
    setSelection([])
  }

  const onDelete = (instance: TableInstance<Lookup>) => () => {
    const valuesUpdater = instance.selectedFlatRows
      .map((r) => r.original)
      .map((l) => {
        const updaters: Promise<any>[] = l.lookupValue.reduce((acc: Promise<any>[], lv) => {
          lv?.id && acc.push(deleteLookupValue.mutateAsync({ id: lv.id }))
          return acc
        }, [])
        return updaters
      })
      .flat()
    Promise.allSettled(valuesUpdater).then(() => {
      const updater = instance.selectedFlatRows
        .map((r) => r.original)
        .map((l) => deleteLookup.mutateAsync({ id: l.id }))
      Promise.allSettled(updater).then(() => invalidateQueries())
    })
  }

  const onEdit = (instance: TableInstance<Lookup>) => () => {
    setShowEdit(true)
    setSelection(instance.selectedFlatRows.map((r) => r.original))
  }

  const onClick = (row: Row<Lookup>) => {
    setShowEdit(true)
    setSelection([row.original])
  }

  return (
    <Page title='Lookups'>
      {showEdit && <LookupsDialog open={showEdit} onClose={onCloseEdit} initialValues={selection[0]} />}
      <Table<Lookup>
        name='lookups'
        data={list}
        columns={columns}
        onAdd={onAdd}
        onDelete={onDelete}
        onEdit={onEdit}
        onClick={onClick}
        onRefresh={() => refetch()}
      />
    </Page>
  )
})

export default Lookups
