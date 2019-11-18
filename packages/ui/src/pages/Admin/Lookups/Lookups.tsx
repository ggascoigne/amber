import { GetLookups_lookups_edges_node } from '__generated__/GetLookups'
import { useDeleteLookup, useDeleteLookupValue, useLookupsQuery } from 'client'
import { GraphQLError, Loader, Page, Table } from 'components/Acnw'
import React, { MouseEventHandler, useState } from 'react'
import { TableInstance } from 'react-table'

import { TableMouseEventHandler } from '../../../../types/react-table-config'
import { LookupsDialog } from './LookupsDialog'

const columns = [
  {
    accessor: 'realm'
  }
]

export const Lookups: React.FC = () => {
  const [showEdit, setShowEdit] = useState(false)
  const [selection, setSelection] = useState<GetLookups_lookups_edges_node[]>([])
  const [deleteLookup] = useDeleteLookup()
  const [deleteLookupValue] = useDeleteLookupValue()
  const { loading, error, data } = useLookupsQuery()

  if (loading || !data) {
    return <Loader />
  }
  if (error) {
    return <GraphQLError error={error} />
  }

  const { lookups } = data!

  const list: GetLookups_lookups_edges_node[] = lookups!.edges
    .map(v => v.node)
    .filter(i => i) as GetLookups_lookups_edges_node[]

  const onAdd: TableMouseEventHandler = () => () => {
    setShowEdit(true)
  }

  const onCloseEdit: MouseEventHandler = () => {
    setShowEdit(false)
    setSelection([])
  }

  const onDelete = (instance: TableInstance<GetLookups_lookups_edges_node>) => () => {
    const toDelete = instance.selectedFlatRows.map(r => r.original)
    const updater = toDelete
      .map(l => {
        const updaters: Promise<any>[] = l.lookupValues.nodes.reduce((acc: Promise<any>[], lv) => {
          lv && lv.id && acc.push(deleteLookupValue({ variables: { input: { id: lv.id } } }))
          return acc
        }, [])
        updaters.push(deleteLookup({ variables: { input: { id: l.id } } }))
        return updaters
      })
      .flat()
    Promise.all(updater).then(() => console.log('deleted'))
  }

  const onEdit = (instance: TableInstance<GetLookups_lookups_edges_node>) => () => {
    setShowEdit(true)
    setSelection(instance.selectedFlatRows.map(r => r.original))
  }

  return (
    <Page>
      {showEdit && <LookupsDialog open={showEdit} onClose={onCloseEdit} initialValues={selection[0]} />}
      <Table name='lookups' data={list} columns={columns} onAdd={onAdd} onDelete={onDelete} onEdit={onEdit} />
    </Page>
  )
}
