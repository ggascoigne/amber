import { GetLookups_lookups_edges_node } from '__generated__/GetLookups'
import { WithLookupsQuery, withLookupsQuery } from 'components/Acnw/LookupsQuery'
import { Page } from 'components/Acnw/Page'
import { Table } from 'components/Acnw/Table/Table'
import React, { MouseEventHandler, useState } from 'react'
import compose from 'recompose/compose'

import { useDeleteLookup, useDeleteLookupValue } from '../../client/queries'
import { GraphQLError } from '../../components/Acnw/GraphQLError'
import { Loader } from '../../components/Acnw/Loader'
import { LookupsDialog } from './LookupsDialog'

const columns = [
  {
    name: 'realm',
    label: 'Realm',
    options: {
      filter: true,
      sort: true
    }
  }
]

const _Lookups: React.FC<WithLookupsQuery> = ({ data: { loading, error, lookups } }) => {
  const [showEdit, setShowEdit] = useState(false)
  const [selection, setSelection] = useState<GetLookups_lookups_edges_node[]>([])
  const deleteLookup = useDeleteLookup()
  const deleteLookupValue = useDeleteLookupValue()

  if (loading || !lookups || !lookups.edges) {
    return <Loader />
  }
  if (error) {
    return <GraphQLError error={error} />
  }

  const data: GetLookups_lookups_edges_node[] = lookups.edges
    .map(v => v.node)
    .filter(i => i) as GetLookups_lookups_edges_node[]

  const onAdd: MouseEventHandler = () => {
    setShowEdit(true)
  }

  const onCloseEdit: MouseEventHandler = () => {
    setShowEdit(false)
    setSelection([])
  }

  const getSelected = (selection: number[], data: GetLookups_lookups_edges_node[]) => {
    return selection.map(dataIndex => data[dataIndex])
  }

  const onDelete = (selection: number[], data: GetLookups_lookups_edges_node[]) => {
    const toDelete = getSelected(selection, data)
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

  const onEdit = (selection: number[], data: GetLookups_lookups_edges_node[]) => {
    setShowEdit(true)
    setSelection(getSelected(selection, data))
  }

  return (
    <Page>
      {showEdit && <LookupsDialog open={showEdit} onClose={onCloseEdit} initialValues={selection[0]} />}
      <Table
        title={'Lookups'}
        data={data}
        columns={columns}
        onAdd={onAdd}
        onDelete={(selection: number[]) => onDelete(selection, data)}
        onEdit={(selection: number[]) => onEdit(selection, data)}
      />
    </Page>
  )
}

export const Lookups = compose<WithLookupsQuery, {}>(withLookupsQuery)(_Lookups)
