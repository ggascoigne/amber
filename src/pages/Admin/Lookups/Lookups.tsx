import {
  useDeleteLookupMutation,
  useDeleteLookupValueMutation,
  useGetLookupsLazyQuery,
  useGetLookupsQuery,
} from 'client'
import { GraphQLError, Loader, Page, Table } from 'components/Acnw'
import React, { MouseEventHandler, useState } from 'react'
import type { Column, Row, TableInstance } from 'react-table'

import type { TableMouseEventHandler } from '../../../../types/react-table-config'
import { LookupsDialog } from './LookupsDialog'
import type { LookupAndValues } from './types'

const columns: Column<LookupAndValues>[] = [
  {
    accessor: 'realm',
  },
]

export const Lookups: React.FC = React.memo(() => {
  const [showEdit, setShowEdit] = useState(false)
  const [selection, setSelection] = useState<LookupAndValues[]>([])
  const [deleteLookup] = useDeleteLookupMutation()
  const [deleteLookupValue] = useDeleteLookupValueMutation()
  const [refreshLookups] = useGetLookupsLazyQuery({ fetchPolicy: 'network-only' })
  const { loading, error, data } = useGetLookupsQuery()

  if (loading || !data) {
    return <Loader />
  }
  if (error) {
    return <GraphQLError error={error} />
  }

  const list: LookupAndValues[] = data!.lookups!.edges.map((v) => v.node).filter((i) => i) as LookupAndValues[]

  const onAdd: TableMouseEventHandler = () => () => {
    setShowEdit(true)
  }

  const onCloseEdit: MouseEventHandler = () => {
    setShowEdit(false)
    setSelection([])
    refreshLookups()
  }

  const onDelete = (instance: TableInstance<LookupAndValues>) => () => {
    const updater = instance.selectedFlatRows
      .map((r) => r.original)
      .map((l) => {
        const updaters: Promise<any>[] = l.lookupValues.nodes.reduce((acc: Promise<any>[], lv) => {
          lv && lv.id && acc.push(deleteLookupValue({ variables: { input: { id: lv.id } } }))
          return acc
        }, [])
        updaters.push(deleteLookup({ variables: { input: { id: l.id } } }))
        return updaters
      })
      .flat()
    Promise.all(updater).then(() => refreshLookups())
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
    <Page>
      {showEdit && <LookupsDialog open={showEdit} onClose={onCloseEdit} initialValues={selection[0]} />}
      <Table<LookupAndValues>
        name='lookups'
        data={list}
        columns={columns}
        onAdd={onAdd}
        onDelete={onDelete}
        onEdit={onEdit}
        onClick={onClick}
      />
    </Page>
  )
})
