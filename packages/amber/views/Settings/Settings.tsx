import React, { MouseEventHandler, useState, useMemo, useCallback } from 'react'

import { useInvalidateSettingsQueries, useTRPC } from '@amber/client'
import { RouterOutputs } from '@amber/server'
import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'
import { useMutation, useQuery } from '@tanstack/react-query'
import { DateTime } from 'luxon'
import { CellProps, Column, Row, TableInstance } from 'react-table'
import { match } from 'ts-pattern'
import { Loader, notEmpty, Page, Table, TooltipCell } from 'ui'

import { AddNewYearDialog } from './AddNewYearDialog'
import { SettingDialog } from './SettingDialog'

import { TransportError } from '../../components/TransportError'
import { TableMouseEventHandler } from '../../types/react-table-config'
import { useConfiguration } from '../../utils'

export type Setting = RouterOutputs['settings']['getSettings'][0]

export const ValueCell: React.FC<CellProps<Setting>> = ({ cell: { value, row } }) => {
  const { baseTimeZone } = useConfiguration()
  const s = match(row.original)
    .with({ type: 'date' }, () => DateTime.fromISO(value).setZone(baseTimeZone).toLocaleString())
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
  const trpc = useTRPC()
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
    [tab?.name],
  )

  const onAddNewYear = useCallback(
    () => () => {
      setShowAddNewYear(true)
    },
    [],
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
    [onAddNewYear],
  )
  const deleteSetting = useMutation(trpc.settings.deleteSetting.mutationOptions())
  const invalidateSettingsQueries = useInvalidateSettingsQueries()

  const { isLoading, error, data, refetch } = useQuery(trpc.settings.getSettings.queryOptions())

  if (error) {
    return <TransportError error={error} />
  }
  if (isLoading || !data) {
    return <Loader />
  }

  const list: Setting[] = data.filter(notEmpty).filter((v) => {
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
    const updater = toDelete.map((s) => deleteSetting.mutateAsync({ id: s.id! }))
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
