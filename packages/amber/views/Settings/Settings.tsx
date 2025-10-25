import React, { useCallback, useMemo, useState } from 'react'

import { useInvalidateSettingsQueries, useTRPC } from '@amber/client'
import type { RouterOutputs } from '@amber/server'
import { notEmpty } from '@amber/ui'
import type { TableSelectionMouseEventHandler, Action } from '@amber/ui/components/Table'
import { Table, TooltipCell, getCellSx } from '@amber/ui/components/Table'
import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'
import { useMutation, useQuery } from '@tanstack/react-query'
import type { CellContext, ColumnDef } from '@tanstack/react-table'
import { DateTime } from 'luxon'
import { match } from 'ts-pattern'

import { AddNewYearDialog } from './AddNewYearDialog'
import { SettingDialog } from './SettingDialog'

import { Page } from '../../components'
import { TransportError } from '../../components/TransportError'
import { useConfiguration } from '../../utils'
import { useStandardHandlers } from '../../utils/useStandardHandlers'

export type Setting = RouterOutputs['settings']['getSettings'][0]

export const ValueCell = (props: CellContext<Setting, unknown>) => {
  const { baseTimeZone } = useConfiguration()
  const value = String(props.getValue<string | number | boolean | null | undefined>() ?? '')
  const s = match(props.row.original)
    .with({ type: 'date' }, () => DateTime.fromISO(value).setZone(baseTimeZone).toLocaleString())
    .otherwise(() => value)
  const sx = getCellSx(props)
  return <TooltipCell text={s} sx={sx} tooltip={s} />
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

const Settings = React.memo(() => {
  const trpc = useTRPC()
  const [value, setValue] = React.useState('config')
  const [showAddNewYear, setShowAddNewYear] = useState(false)

  const tab = tabs.find((t) => t.name === value)

  const columns: ColumnDef<Setting>[] = useMemo(
    () => [
      {
        id: 'code',
        header: 'Code',
        accessorFn: (originalRow: Setting) => originalRow.code.substring(tab?.name ? tab.name.length + 1 : 0),
      },
      {
        accessorKey: 'value',
        header: 'Value',
        cell: ValueCell,
      },
      {
        accessorKey: 'type',
        header: 'Type',
      },
    ],
    [tab?.name],
  )

  const handleAddNewYear: TableSelectionMouseEventHandler<Setting> = () => {
    setShowAddNewYear(true)
  }

  const toolbarActions: Action<Setting>[] = [
    {
      label: 'Add New Year',
      onClick: handleAddNewYear,
      enabled: () => true,
    },
  ]
  const deleteSetting = useMutation(trpc.settings.deleteSetting.mutationOptions())
  const invalidateSettingsQueries = useInvalidateSettingsQueries()

  const {
    isLoading,
    isFetching,
    error,
    data = [],
    refetch,
  } = useQuery(
    trpc.settings.getSettings.queryOptions(undefined, {
      staleTime: 60 * 60 * 1000, // 1 hour - settings rarely change
      refetchOnMount: false,
      refetchOnReconnect: false,
    }),
  )

  const { showEdit, selection, handleCloseEdit, onAdd, onEdit, onRowClick, onDelete } = useStandardHandlers<Setting>({
    deleteHandler: (selectedRows) => selectedRows.map((row) => deleteSetting.mutateAsync({ id: row.id })),
    invalidateQueries: invalidateSettingsQueries,
    onCloseCallback: () => setShowAddNewYear(false),
  })

  const list: Setting[] = useMemo(
    () =>
      data.filter(notEmpty).filter((v) => {
        if (tab?.exclude) {
          return v.code.startsWith(`${value}.`) && !v.code.startsWith(`${tab.exclude}.`)
        }
        return v.code.startsWith(`${value}.`)
      }),
    [data, value, tab?.exclude],
  )

  const handleTabChange = useCallback((_event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue)
  }, [])

  if (error) {
    return <TransportError error={error} />
  }

  const a11yProps = (t: string) => ({
    id: `settings-tab-${t}`,
    'aria-controls': `simple-tabpanel-${t}`,
  })

  return (
    <Page title='Settings' variant='fill'>
      {showEdit && <SettingDialog open={showEdit} onClose={handleCloseEdit} initialValues={selection[0]} />}
      <Tabs value={value} onChange={handleTabChange} aria-label='settings tabs' sx={{ pl: 3 }}>
        {tabs.map((t) => (
          <Tab key={t.name} label={t.label} {...a11yProps(t.name)} value={t.name} />
        ))}
      </Tabs>
      {showAddNewYear && <AddNewYearDialog open={showAddNewYear} onClose={handleCloseEdit} />}

      <Table<Setting>
        // title='Settings'
        name='settings'
        data={list}
        columns={columns}
        isLoading={isLoading}
        isFetching={isFetching}
        onRowClick={onRowClick}
        onAdd={onAdd}
        onEdit={onEdit}
        onDelete={onDelete}
        refetch={refetch}
        additionalToolbarActions={toolbarActions}
        enableGrouping={false}
        sx={{ pt: 2 }}
      />
    </Page>
  )
})

export default Settings
