import { useCallback, useEffect, useMemo, useState } from 'react'

import type { Action } from '@amber/ui/components/Table'
import { zeroSelected, getSelectedRows, someSelected, Table, SelectColumnFilter } from '@amber/ui/components/Table'
import AddIcon from '@mui/icons-material/Add'
import { Box, Slider, Typography, Stack } from '@mui/material'
import type { Row, Table as TableInstance } from '@tanstack/react-table'
import { createColumnHelper } from '@tanstack/react-table'

import { Page, Toggle } from '@/Components'
import type { UserType } from '@/utils/queries'
import { useAllUsersQuery } from '@/utils/queries'

const subscriptionFilterOptions = [
  { value: '', label: 'All' },
  { value: 'free', label: 'Free' },
  { value: 'basic', label: 'Basic' },
  { value: 'pro', label: 'Pro' },
  { value: 'enterprise', label: 'Enterprise' },
]

const INFINITE = '\u221E'

const sliderValues = [
  { label: '0', value: 0 },
  { label: '1', value: 1 },
  { label: '2', value: 2 },
  { label: '5', value: 3 },
  { label: '10', value: 4 },
  { label: '50', value: 5 },
  { label: '100', value: 6 },
  { label: INFINITE, value: 7 },
]

const calculateValue = (value: number) => {
  const val = sliderValues.find((v) => v.value === value)
  return parseInt(val?.label ?? '0', 10)
}

const valueLabelFormat = (value: number) => {
  const val = sliderValues.find((v) => parseInt(v.label, 10) === value)
  return val?.label ?? INFINITE
}

const getDesiredRows = (value: number) => (value === sliderValues.length - 1 ? 100_000 : calculateValue(value))

const columnHelper = createColumnHelper<UserType>()

const flatColumns = [
  columnHelper.accessor('firstName', {
    enableColumnFilter: true,
  }),
  columnHelper.accessor('lastName', {
    enableColumnFilter: true,
  }),
  columnHelper.accessor('fullName', {
    enableColumnFilter: true,
  }),
  columnHelper.accessor('email', {}),
  columnHelper.accessor('address', {}),
  columnHelper.accessor('city', {}),
  columnHelper.accessor('state', {}),
  columnHelper.accessor('zipCode', {}),
  columnHelper.accessor('phone', {}),
  columnHelper.accessor('gender', {
    meta: {
      filterFlags: {
        filterRender: SelectColumnFilter,
        options: ['Male', 'Female', 'Other'],
      },
    },
  }),
  columnHelper.accessor('subscriptionTier', {
    header: 'Subscription',
    meta: {
      filterFlags: {
        filterRender: SelectColumnFilter,
        options: subscriptionFilterOptions,
        alwaysShow: true,
      },
    },
  }),
]

const groupedColumns = [
  {
    header: 'User',
    columns: [
      columnHelper.accessor('firstName', {
        enableColumnFilter: true,
      }),
      columnHelper.accessor('lastName', {
        enableColumnFilter: true,
      }),
      columnHelper.accessor('fullName', {
        enableColumnFilter: true,
      }),
      columnHelper.accessor('gender', {
        meta: {
          filterFlags: {
            filterRender: SelectColumnFilter,
            options: ['Male', 'Female', 'Other'],
          },
        },
      }),
    ],
  },
  {
    header: 'Address',
    columns: [
      columnHelper.accessor('email', {}),
      columnHelper.accessor('address', {}),
      columnHelper.accessor('city', {}),
      columnHelper.accessor('state', {}),
      columnHelper.accessor('zipCode', {}),
      columnHelper.accessor('phone', {}),
    ],
  },
  {
    header: 'Subscription',
    columns: [
      columnHelper.accessor('subscriptionTier', {
        header: 'Subscription',
        meta: {
          filterFlags: {
            filterRender: SelectColumnFilter,
            options: subscriptionFilterOptions,
            alwaysShow: true,
          },
        },
      }),
    ],
  },
]
export const TablePlayground = ({ title }: { title: string }) => {
  const { data, isLoading, isFetching, refetch } = useAllUsersQuery()

  const onRowClick = useCallback((row: Row<UserType>) => {
    console.log(row)
  }, [])

  const [compact, setCompact] = useState(false)
  const [debug, setDebug] = useState(false)
  const [virtual, setVirtual] = useState(true)
  const [flexRows, setFlexRows] = useState(true)
  const [isBounded, setIsBounded] = useState(true)
  const [showFilters, setShowFilters] = useState(true)
  const [showSearch, setShowSearch] = useState(true)
  const [desiredRowCountIndex, setDesiredRowCountIndex] = useState(sliderValues.length - 1)
  const [enableSelect, setEnableSelect] = useState(true)
  const [showColumnGroups, setShowColumnGroups] = useState(false)

  const [fakeIsLoading, setFakeIsLoading] = useState(isLoading)
  const [fakeIsFetching, setFakeIsFetching] = useState(isFetching)

  useEffect(() => {
    setFakeIsLoading(isLoading)
  }, [isLoading])
  useEffect(() => {
    setFakeIsFetching(isFetching)
  }, [isFetching])

  const [truncatedData, _desiredRowCount] = useMemo(() => {
    const rc = getDesiredRows(desiredRowCountIndex)
    return [data?.rows?.slice(0, rc), rc] as const
  }, [data?.rows, desiredRowCountIndex])

  const [toolbarActions, rowActions] = useMemo(() => {
    const dummy = (commandName: string) => (instance: TableInstance<UserType>, selectedKeys: string[]) => {
      console.log(`Toolbar Action ${commandName} Clicked`, instance, selectedKeys)
    }
    const addAction = {
      label: 'Add',
      onClick: dummy('Add'),
      icon: <AddIcon />,
      enabled: zeroSelected,
    }
    const action1 = {
      label: 'Action 1',
      onClick: dummy('Action 1'),
      enabled: (instance: TableInstance<UserType>, selectedKeys: string[]) => {
        const rows = getSelectedRows(instance, selectedKeys)
        return rows.length > 0 && !!rows.find((r) => ['free'].includes(r.subscriptionTier))
      },
    }
    const action2 = {
      label: 'Action 2',
      onClick: dummy('Action 2'),
      enabled: (instance: TableInstance<UserType>, selectedKeys: string[]) => {
        const rows = getSelectedRows(instance, selectedKeys)
        return rows.length > 0 && !!rows.find((r) => ['free', 'basic'].includes(r.subscriptionTier))
      },
    }
    const action3 = {
      label: 'Action 3',
      onClick: dummy('Action 3'),
      enabled: (instance: TableInstance<UserType>, selectedKeys: string[]) => {
        const rows = getSelectedRows(instance, selectedKeys)
        return rows.length > 0 && !!rows.find((r) => ['free', 'basic', 'pro'].includes(r.subscriptionTier))
      },
    }
    const action4 = {
      label: 'Action 4',
      onClick: dummy('Action 4'),
      enabled: someSelected,
    }

    const toolbarA: Action<UserType>[] = [addAction, action1, action2, action3, action4]

    const rowsA: Action<UserType>[] = [
      {
        action: 'menu',
        // collapse: false,
        actions: [action1, action2, action3, action4],
      },
    ]
    return [toolbarA, rowsA]
  }, [])

  return (
    <Page title={title} sx={{ position: 'relative', width: '100%', overflow: 'auto' }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          pb: 2,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            maxWidth: '100%',
            flexWrap: 'wrap',
            flexDirection: 'row-reverse',
          }}
        >
          <Toggle label='Show Search' value={showSearch} setter={setShowSearch} />
          <Toggle label='Show Filters' value={showFilters} setter={setShowFilters} />
          <Toggle label='Compact' value={compact} setter={setCompact} />
          <Toggle label='Debug' value={debug} setter={setDebug} />
          <Toggle label='Virtualize Rows' value={virtual} setter={setVirtual} />
          <Toggle label='Flex Rows' value={flexRows} setter={setFlexRows} />
          <Toggle label='Bounded' value={isBounded} setter={setIsBounded} />
          <Toggle label='EnableSelect' value={enableSelect} setter={setEnableSelect} />
          <Toggle label='Force isLoading' value={fakeIsLoading} setter={setFakeIsLoading} />
          <Toggle label='Force isFetching' value={fakeIsFetching} setter={setFakeIsFetching} />
          <Toggle label='Group Columns' value={showColumnGroups} setter={setShowColumnGroups} />
          <Stack spacing={2} direction='row' sx={{ minWidth: 380, py: 1, px: 3 }} alignItems='center'>
            <Typography gutterBottom sx={{ minWidth: 80 }}>
              Max Rows
            </Typography>
            <Slider
              value={desiredRowCountIndex}
              min={0}
              marks={sliderValues}
              max={sliderValues.length - 1}
              scale={calculateValue}
              getAriaValueText={valueLabelFormat}
              valueLabelFormat={valueLabelFormat}
              onChange={(event: Event, value: number | number[]) => setDesiredRowCountIndex(value as number)}
              valueLabelDisplay='auto'
              aria-labelledby='non-linear-slider'
              sx={{ mt: 2 }}
            />
          </Stack>
        </Box>
      </Box>
      <Table
        name='table-playground'
        keyField='id'
        columns={showColumnGroups ? groupedColumns : flatColumns}
        data={truncatedData ?? []}
        isLoading={fakeIsLoading}
        isFetching={fakeIsFetching}
        refetch={refetch}
        toolbarActions={toolbarActions}
        rowActions={rowActions}
        scrollBehavior={isBounded ? 'bounded' : 'none'}
        onRowClick={onRowClick}
        debug={debug}
        rowStyle={flexRows ? 'flex' : 'fixed'}
        useVirtualRows={virtual}
        compact={compact}
        enableRowSelection={enableSelect}
        enableGlobalFilter={showSearch}
        enableColumnFilters={showFilters}
      />
    </Page>
  )
}
