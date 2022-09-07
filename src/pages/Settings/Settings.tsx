import { GetSettingsQuery, useDeleteSettingMutation, useGetSettingsQuery } from 'client'
import React, { MouseEventHandler, useState } from 'react'
import { useQueryClient } from 'react-query'
import { Column, Row, TableInstance } from 'react-table'
import { GqlType, notEmpty } from 'utils'

import { TableMouseEventHandler } from '../../../types/react-table-config'
import { GraphQLError } from '../../components/GraphQLError'
import { Loader } from '../../components/Loader'
import { Page } from '../../components/Page'
import { Table } from '../../components/Table'
import { SettingDialog } from './SettingDialog'

export type Setting = GqlType<GetSettingsQuery, ['settings', 'nodes', number]>

const columns: Column<Setting>[] = [
  {
    accessor: 'code',
  },
  {
    accessor: 'value',
  },
  {
    accessor: 'type',
  },
]

const Settings: React.FC = React.memo(() => {
  const [showEdit, setShowEdit] = useState(false)
  const [selection, setSelection] = useState<Setting[]>([])

  const deleteSetting = useDeleteSettingMutation()
  const queryClient = useQueryClient()

  const { isLoading, error, data, refetch } = useGetSettingsQuery()

  if (error) {
    return <GraphQLError error={error} />
  }
  if (isLoading || !data) {
    return <Loader />
  }

  const list: Setting[] = data.settings!.nodes.filter(notEmpty)

  const clearSelectionAndRefresh = () => {
    setSelection([])
    // noinspection JSIgnoredPromiseFromCall
    queryClient.invalidateQueries('getSettings')
  }

  const onAdd: TableMouseEventHandler<Setting> = () => () => {
    setShowEdit(true)
  }

  const onCloseEdit: MouseEventHandler = () => {
    setShowEdit(false)
    clearSelectionAndRefresh()
  }

  const onDelete = (instance: TableInstance<Setting>) => () => {
    const toDelete = instance.selectedFlatRows.map((r) => r.original)
    const updater = toDelete.map((s) => deleteSetting.mutateAsync({ input: { id: s.id } }))
    Promise.allSettled(updater).then(() => {
      console.log('deleted')
      clearSelectionAndRefresh()
      instance.toggleAllRowsSelected(false)
    })
  }

  const onEdit = (instance: TableInstance<Setting>) => () => {
    setShowEdit(true)
    setSelection(instance.selectedFlatRows.map((r) => r.original))
  }

  const onClick = (row: Row<Setting>) => {
    setShowEdit(true)
    setSelection([row.original])
  }

  return (
    <Page title='Settings'>
      {showEdit && <SettingDialog open={showEdit} onClose={onCloseEdit} initialValues={selection[0]} />}
      <Table<Setting>
        name='settings'
        data={list}
        columns={columns}
        onAdd={onAdd}
        disableGroupBy
        onDelete={onDelete}
        onEdit={onEdit}
        onClick={onClick}
        onRefresh={() => refetch()}
      />
    </Page>
  )
})

export default Settings
