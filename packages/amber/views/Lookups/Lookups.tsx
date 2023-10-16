import React, { MouseEventHandler, useState } from 'react'

import { useQueryClient } from '@tanstack/react-query'
import type { Column, Row, TableInstance } from 'react-table'
import { GqlType, GraphQLError, Loader, notEmpty, Page, Table } from 'ui'

import { LookupsDialog } from './LookupsDialog'

import {
  GetLookupsQuery,
  useGraphQLMutation,
  useGraphQL,
  DeleteLookupDocument,
  DeleteLookupValueDocument,
  GetLookupsDocument,
} from '../../client'
import type { TableMouseEventHandler } from '../../types/react-table-config'

export type LookupAndValues = GqlType<GetLookupsQuery, ['lookups', 'edges', number, 'node']>

const columns: Column<LookupAndValues>[] = [
  {
    accessor: 'realm',
  },
]

const Lookups: React.FC = React.memo(() => {
  const [showEdit, setShowEdit] = useState(false)
  const [selection, setSelection] = useState<LookupAndValues[]>([])
  const deleteLookup = useGraphQLMutation(DeleteLookupDocument)
  const deleteLookupValue = useGraphQLMutation(DeleteLookupValueDocument)
  const queryClient = useQueryClient()

  const { isLoading, error, data, refetch } = useGraphQL(GetLookupsDocument)

  if (error) {
    return <GraphQLError error={error} />
  }
  if (isLoading || !data) {
    return <Loader />
  }

  const list: LookupAndValues[] = data.lookups!.edges.map((v) => v.node).filter(notEmpty)

  const onAdd: TableMouseEventHandler<LookupAndValues> = () => () => {
    setShowEdit(true)
  }

  const onCloseEdit: MouseEventHandler = () => {
    setShowEdit(false)
    setSelection([])
    // noinspection JSIgnoredPromiseFromCall
    queryClient.invalidateQueries(['getLookups'])
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
    Promise.allSettled(updater).then(() => queryClient.invalidateQueries(['getLookups']))
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
    <Page title='Lookups'>
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
