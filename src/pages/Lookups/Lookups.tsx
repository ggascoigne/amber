import { useDeleteLookupMutation, useDeleteLookupValueMutation, useGetLookupsQuery } from 'client'
import { GraphQLError, Loader, Page, Table } from 'components/Acnw'
import React, { MouseEventHandler, useState } from 'react'
import { useQueryClient } from 'react-query'
import type { Column, Row, TableInstance } from 'react-table'

import type { TableMouseEventHandler } from '../../../types/react-table-config'
import { notEmpty } from '../../utils'
import { LookupsDialog } from './LookupsDialog'
import type { LookupAndValues } from './types'

const columns: Column<LookupAndValues>[] = [
  {
    accessor: 'realm',
  },
]

const Lookups: React.FC = React.memo(() => {
  const [showEdit, setShowEdit] = useState(false)
  const [selection, setSelection] = useState<LookupAndValues[]>([])
  const deleteLookup = useDeleteLookupMutation()
  const deleteLookupValue = useDeleteLookupValueMutation()
  const queryClient = useQueryClient()

  const { isLoading, error, data, refetch } = useGetLookupsQuery()

  if (error) {
    return <GraphQLError error={error} />
  }
  if (isLoading || !data) {
    return <Loader />
  }

  const list: LookupAndValues[] = data.lookups!.edges.map((v) => v.node).filter(notEmpty)

  const onAdd: TableMouseEventHandler = () => () => {
    setShowEdit(true)
  }

  const onCloseEdit: MouseEventHandler = () => {
    setShowEdit(false)
    setSelection([])
    queryClient.invalidateQueries('getLookups')
  }

  const onDelete = (instance: TableInstance<LookupAndValues>) => () => {
    const updater = instance.selectedFlatRows
      .map((r) => r.original)
      .map((l) => {
        const updaters: Promise<any>[] = l.lookupValues.nodes.reduce((acc: Promise<any>[], lv) => {
          lv?.id && acc.push(deleteLookupValue.mutateAsync({ input: { id: lv.id } }))
          return acc
        }, [])
        updaters.push(deleteLookup.mutateAsync({ input: { id: l.id } }))
        return updaters
      })
      .flat()
    Promise.allSettled(updater).then(() => queryClient.invalidateQueries('getLookups'))
  }

  const onEdit = (instance: TableInstance<LookupAndValues>) => () => {
    setShowEdit(true)
    setSelection(instance.selectedFlatRows.map((r) => r.original))
  }

  const onClick = (row: Row<LookupAndValues>) => {
    setShowEdit(true)
    setSelection([row.original])
  }

  return (
    <Page title='Lookup'>
      {showEdit && <LookupsDialog open={showEdit} onClose={onCloseEdit} initialValues={selection[0]} />}
      <Table<LookupAndValues>
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
