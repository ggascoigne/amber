import { useCallback, useMemo, useRef, useState } from 'react'

import type { Action } from '@amber/ui/components/Table'
import { someSelected, zeroSelected, getDefaultSort, Table } from '@amber/ui/components/Table'
import AddIcon from '@mui/icons-material/Add'
import { Box, Slider, Stack, Typography } from '@mui/material'
import type { Table as TableInstance, Row, TableState } from '@tanstack/react-table'
import { createColumnHelper } from '@tanstack/react-table'

import { Toggle, Page } from '@/Components'
import type { UserType } from '@/utils/queries'
import { useUsersQuery } from '@/utils/queries'

const columnHelper = createColumnHelper<UserType>()

const columns = [
  columnHelper.accessor('firstName', {
    enableColumnFilter: true,
  }),
  columnHelper.accessor('lastName', {
    enableColumnFilter: true,
  }),
  columnHelper.accessor('email', {}),
]

type ExampleTableProps = {
  enableRowSelection: boolean
  index: number
  compact: boolean
  withSearch: boolean
  withFilters: boolean
  displayGutter: boolean
  displayPagination: boolean
  showToolbarActions: boolean
  showSystemActions: boolean
  elevation: number
  hideHeader: boolean
  compactPagination: boolean
  debug: boolean
  variant: 'outlined' | 'elevation'
}

const ExampleTable = ({
  enableRowSelection = false,
  index,
  compact,
  withSearch,
  withFilters,
  displayGutter,
  displayPagination,
  showToolbarActions,
  showSystemActions,
  elevation,
  hideHeader,
  compactPagination,
  debug,
  variant,
}: ExampleTableProps) => {
  const [state, setState] = useState<Partial<TableState> | undefined>(undefined)
  const handleStateChange = useCallback((newState: TableState) => {
    setState({
      pagination: newState?.pagination,
      sorting: newState?.sorting ?? [],
      globalFilter: newState?.globalFilter,
      columnFilters: newState?.columnFilters,
    })
  }, [])

  const { data } = useUsersQuery(
    {
      pageIndex: state?.pagination?.pageIndex ?? 0,
      pageSize: state?.pagination?.pageSize ?? 10,
      sorting: state?.sorting ?? [],
      globalFilter: state?.globalFilter ?? '',
      filters: state?.columnFilters,
    },
    { enabled: !!state },
  )

  const dummy = useCallback(
    (commandName: string) =>
      (instance: TableInstance<UserType>, selectedKeys: string[] | string, allSelected?: boolean) => {
        console.log(`Toolbar Action ${commandName} Clicked`, instance, selectedKeys, allSelected)
      },
    [],
  )

  const onRowClick = useCallback((row: Row<UserType>) => {
    console.log(row)
  }, [])

  const toolbarActions: Action<UserType>[] = useMemo(() => {
    const addAction = {
      label: 'Add Group',
      onClick: dummy('Add Group'),
      icon: <AddIcon />,
      enabled: zeroSelected,
    }
    const resetAction = {
      label: 'Reset',
      onClick: dummy('Reset'),
      enabled: someSelected,
    }
    const assignAction = {
      label: 'Assign',
      onClick: dummy('Assign'),
      enabled: someSelected,
    }
    return [
      addAction,
      resetAction,
      assignAction,
      {
        action: 'menu',
        actions: [
          {
            ...resetAction,
            icon: <AddIcon />,
          },
          assignAction,
        ],
      },
    ]
  }, [dummy])

  return (
    <Table
      sx={{ width: '600px' }}
      name={`Users Table ${index}`}
      keyField='id'
      columns={columns}
      data={data?.rows ?? []}
      toolbarActions={showToolbarActions ? toolbarActions : undefined}
      systemActions={showSystemActions ? undefined : []}
      onRowClick={onRowClick}
      displayPagination={displayPagination ? 'always' : 'never'}
      displayGutter={displayGutter}
      debug={debug}
      compact={compact}
      elevation={elevation}
      hideHeader={hideHeader}
      paginationStyle={compactPagination ? 'compact' : 'default'}
      variant={variant}
      handleStateChange={handleStateChange}
      enableRowSelection={enableRowSelection}
      enableGlobalFilter={withSearch}
      enableColumnFilters={withFilters}
      initialState={{
        pagination: {
          pageSize: 2,
          pageIndex: 0,
        },
        sorting: getDefaultSort(columns),
        globalFilter: '',
      }}
      rowCount={data?.rowCount ?? 0}
    />
  )
}

export const Layouts = ({ title }: { title: string }) => {
  const [compact, setCompact] = useState(false)
  const [enableRowSelection, setEnableRowSelection] = useState(true)
  const [displayGutter, setDisplayGutter] = useState(true)
  const [displayPagination, setDisplayPagination] = useState(true)
  const [showToolbarActions, setShowToolbarActions] = useState(true)
  const [showSystemActions, setShowSystemActions] = useState(true)
  const [showOutline, setShowOutline] = useState(false)
  const [hideHeader, setHideHeader] = useState(false)
  const [compactPagination, setCompactPagination] = useState(false)
  const [debug, setDebug] = useState(false)
  const [desiredElevation, setElevation] = useState(1)

  const pageRef = useRef<HTMLDivElement>(null)

  const data = [
    { withSearch: true, withFilters: true },
    { withSearch: true, withFilters: false },
    { withSearch: false, withFilters: true },
    { withSearch: false, withFilters: false },
  ]

  return (
    <Page ref={pageRef} title={title} sx={{ position: 'relative', width: '100%', overflow: 'auto' }}>
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
          <Toggle label='Compact' value={compact} setter={setCompact} />
          <Toggle label='Enable Select' value={enableRowSelection} setter={setEnableRowSelection} />
          <Toggle label='Show Gutter' value={displayGutter} setter={setDisplayGutter} />
          <Toggle label='Show Pagination' value={displayPagination} setter={setDisplayPagination} />
          <Toggle label='Show Toolbar Actions' value={showToolbarActions} setter={setShowToolbarActions} />
          <Toggle label='Show System Actions' value={showSystemActions} setter={setShowSystemActions} />
          <Toggle label='Hide Header' value={hideHeader} setter={setHideHeader} />
          <Toggle label='Compact Pagination' value={compactPagination} setter={setCompactPagination} />
          <Toggle label='Debug' value={debug} setter={setDebug} />
          <Stack spacing={2} direction='row' sx={{ minWidth: 380, py: 1, px: 3 }} alignItems='center'>
            <Typography gutterBottom sx={{ minWidth: 80 }}>
              Elevation
            </Typography>
            <Slider
              value={desiredElevation}
              min={0}
              marks
              max={5}
              onChange={(event: Event, value: number | number[]) => setElevation(value as number)}
              valueLabelDisplay='auto'
              sx={{ mt: 2 }}
              // disabled={showOutline}
            />
          </Stack>{' '}
          <Toggle label='Outline' value={showOutline} setter={setShowOutline} />
        </Box>
      </Box>
      <Box
        sx={{
          width: '100%',
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap',
          alignContent: 'flex-start',
          gap: 3,
          p: 1,
        }}
      >
        {data.map((d, index) => (
          <Box key={`key_${index}`}>
            <ExampleTable
              key={`key_${index}`}
              index={index}
              {...d}
              compact={compact}
              enableRowSelection={enableRowSelection}
              displayGutter={displayGutter}
              displayPagination={displayPagination}
              showToolbarActions={showToolbarActions}
              showSystemActions={showSystemActions}
              hideHeader={hideHeader}
              compactPagination={compactPagination}
              debug={debug}
              elevation={desiredElevation}
              variant={showOutline ? 'outlined' : 'elevation'}
            />
            <Box
              sx={{
                flexGrow: 1,
              }}
            />
          </Box>
        ))}
      </Box>
    </Page>
  )
}
