import { SettingFieldsFragment, useDeleteSettingMutation, useGetSettingsQuery } from 'client'
import React, { MouseEventHandler, useState } from 'react'
import { useQueryClient } from 'react-query'
import { Column, Row, TableInstance } from 'react-table'

import { TableMouseEventHandler } from '../../../types/react-table-config'
import { Page, Table } from '../../components/Acnw'
import { GraphQLError } from '../../components/Acnw/GraphQLError'
import { Loader } from '../../components/Acnw/Loader'
import { notEmpty } from '../../utils'
import { SettingDialog } from './SettingDialog'

type Setting = SettingFieldsFragment

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
  const { error, data, refetch } = useGetSettingsQuery()

  if (error) {
    return <GraphQLError error={error} />
  }

  if (!data) {
    return <Loader />
  }
  const { settings } = data

  const list: Setting[] = settings!.nodes.filter(notEmpty)

  const onAdd: TableMouseEventHandler = () => () => {
    setShowEdit(true)
  }

  const onCloseEdit: MouseEventHandler = () => {
    setShowEdit(false)
    setSelection([])
  }

  const onDelete = (instance: TableInstance<Setting>) => () => {
    const toDelete = instance.selectedFlatRows.map((r) => r.original)
    const updater = toDelete.map((s) =>
      deleteSetting.mutateAsync(
        {
          input: { id: s.id },
        },
        {
          onSuccess: () => {
            queryClient.invalidateQueries('getSettings')
          },
        }
      )
    )
    Promise.allSettled(updater).then(() => {
      console.log('deleted')
      instance.toggleAllRowsSelected(false)
      setSelection([])
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
