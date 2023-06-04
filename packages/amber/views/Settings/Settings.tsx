import React, { MouseEventHandler, useState, useMemo, useCallback } from 'react'

import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'
import { DateTime } from 'luxon'
import { CellProps, Column, Row, TableInstance } from 'react-table'
import { match } from 'ts-pattern'
import { GraphQLError, Loader, notEmpty, Page, Table, TooltipCell } from 'ui'

import { AddNewYearDialog } from './AddNewYearDialog'
import { SettingDialog } from './SettingDialog'
import { Setting } from './shared'

import { useDeleteSettingMutation, useGetSettingsQuery } from '../../client'
import { useInvalidateSettingsQueries } from '../../client/querySets'
import { TableMouseEventHandler } from '../../types/react-table-config'

export const ValueCell: React.FC<CellProps<Setting>> = ({ cell: { value, row } }) => {
  const s = match(row.original)
    .with({ type: 'date' }, () => DateTime.fromISO(value).toLocaleString())
    .otherwise(() => value)
  return <TooltipCell text={s} align='left' tooltip={s} />
}

const tabs = [
  {
    name: 'config',
    label: 'Configuration',
    exclude: 'config.startDates',
  },
  {
    name: 'config.startDates',
    label: 'Start Dates',
  },
  { name: 'flag', label: 'Flags' },
  { name: 'url', label: 'Urls' },
]

const Settings: React.FC = React.memo(() => {
  const [showEdit, setShowEdit] = useState(false)
  const [selection, setSelection] = useState<Setting[]>([])
  const [value, setValue] = React.useState('config')
  const [showAddNewYear, setShowAddNewYear] = useState(false)

  const tab = tabs.find((t) => t.name === value)

  const columns: Column<Setting>[] = useMemo(
    () => [
      {
        accessor: (originalRow: Setting) => originalRow.code.substring(tab?.name ? tab.name.length + 1 : 0),
        id: 'code',
      },
      {
        accessor: 'value',
        Cell: ValueCell,
      },
      {
        accessor: 'type',
      },
    ],
    [tab?.name]
  )

  const onAddNewYear = useCallback(
    () => () => {
      setShowAddNewYear(true)
    },
    []
  )
  const commands = useMemo(
    () => [
      {
        label: 'Add New Year',
        onClick: onAddNewYear,
        enabled: () => true,
        type: 'button' as const,
      },
    ],
    [onAddNewYear]
  )

  const deleteSetting = useDeleteSettingMutation()
  const invalidateSettingsQueries = useInvalidateSettingsQueries()

  const { isLoading, error, data, refetch } = useGetSettingsQuery()

  if (error) {
    return <GraphQLError error={error} />
  }
  if (isLoading || !data) {
    return <Loader />
  }

  const list: Setting[] = data.settings!.nodes.filter(notEmpty).filter((v) => {
    if (tab?.exclude) {
      return v.code.startsWith(`${value}.`) && !v.code.startsWith(`${tab.exclude}.`)
    }
    return v.code.startsWith(`${value}.`)
  })

  const clearSelectionAndRefresh = () => {
    setSelection([])
    invalidateSettingsQueries()
  }

  const onAdd: TableMouseEventHandler<Setting> = () => () => {
    setShowEdit(true)
  }

  const onCloseEdit: MouseEventHandler = () => {
    setShowEdit(false)
    setShowAddNewYear(false)
    clearSelectionAndRefresh()
  }

  const onDelete = (instance: TableInstance<Setting>) => () => {
    const toDelete = instance.selectedFlatRows.map((r) => r.original)
    const updater = toDelete.map((s) => deleteSetting.mutateAsync({ input: { id: s.id! } }))
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

  const a11yProps = (t: string) => ({
    id: `settings-tab-${t}`,
    'aria-controls': `simple-tabpanel-${t}`,
  })

  const handleTabChange = (_event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue)
  }

  return (
    <Page title='Settings'>
      {showEdit && <SettingDialog open={showEdit} onClose={onCloseEdit} initialValues={selection[0]} />}
      <Tabs value={value} onChange={handleTabChange} aria-label='settings tabs'>
        {tabs.map((t) => (
          <Tab key={t.name} label={t.label} {...a11yProps(t.name)} value={t.name} />
        ))}
      </Tabs>
      {showAddNewYear && <AddNewYearDialog open={showAddNewYear} onClose={onCloseEdit} />}

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
        extraCommands={commands}
      />
    </Page>
  )
})

export default Settings
