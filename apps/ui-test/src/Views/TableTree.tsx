import { useState } from 'react'

import { Table } from '@amber/ui/components/Table'
import Box from '@mui/material/Box'
import { createColumnHelper } from '@tanstack/react-table'

import { Page, Toggle } from '@/Components'

type TreeDemoRow = {
  id: string
  name: string
  owner: string
  status: 'Ready' | 'Draft' | 'Review'
  children?: Array<TreeDemoRow>
}

const treeRows: Array<TreeDemoRow> = [
  {
    id: 'convention',
    name: 'Convention',
    owner: 'Core Team',
    status: 'Ready',
    children: [
      {
        id: 'admissions',
        name: 'Admissions',
        owner: 'Morgan',
        status: 'Ready',
        children: [
          {
            id: 'badge-pickup',
            name: 'Badge Pickup',
            owner: 'Alex',
            status: 'Ready',
          },
          {
            id: 'help-desk',
            name: 'Help Desk',
            owner: 'Casey',
            status: 'Draft',
          },
        ],
      },
      {
        id: 'programming',
        name: 'Programming',
        owner: 'Riley',
        status: 'Review',
        children: [
          {
            id: 'panels',
            name: 'Panels',
            owner: 'Jordan',
            status: 'Ready',
            children: [
              {
                id: 'morning-panel',
                name: 'Morning Panel',
                owner: 'Taylor',
                status: 'Ready',
              },
              {
                id: 'evening-panel',
                name: 'Evening Panel',
                owner: 'Parker',
                status: 'Review',
              },
            ],
          },
          {
            id: 'games',
            name: 'Games',
            owner: 'Quinn',
            status: 'Ready',
            children: [
              {
                id: 'tabletop',
                name: 'Tabletop',
                owner: 'Avery',
                status: 'Ready',
              },
              {
                id: 'larp',
                name: 'LARP',
                owner: 'Skyler',
                status: 'Draft',
              },
              {
                id: 'tournament',
                name: 'Tournament',
                owner: 'Jamie',
                status: 'Review',
              },
            ],
          },
          {
            id: 'workshops',
            name: 'Workshops',
            owner: 'Harper',
            status: 'Draft',
          },
        ],
      },
      {
        id: 'operations',
        name: 'Operations',
        owner: 'Drew',
        status: 'Review',
        children: [
          {
            id: 'logistics',
            name: 'Logistics',
            owner: 'Rowan',
            status: 'Ready',
            children: [
              {
                id: 'load-in',
                name: 'Load In',
                owner: 'Emerson',
                status: 'Ready',
              },
              {
                id: 'room-reset',
                name: 'Room Reset',
                owner: 'Finley',
                status: 'Draft',
              },
            ],
          },
          {
            id: 'volunteers',
            name: 'Volunteers',
            owner: 'Reese',
            status: 'Ready',
          },
        ],
      },
      {
        id: 'sponsors',
        name: 'Sponsors',
        owner: 'Blair',
        status: 'Draft',
        children: [
          {
            id: 'sponsor-lounge',
            name: 'Sponsor Lounge',
            owner: 'Devon',
            status: 'Review',
          },
        ],
      },
    ],
  },
]

const expandedRows = {
  admissions: true,
  convention: true,
  games: true,
  logistics: true,
  operations: true,
  panels: true,
  programming: true,
  sponsors: true,
}

const columnHelper = createColumnHelper<TreeDemoRow>()

const columns = [
  columnHelper.accessor('name', {
    header: 'Area',
    size: 260,
  }),
  columnHelper.accessor('owner', {
    header: 'Owner',
    size: 160,
  }),
  columnHelper.accessor('status', {
    header: 'Status',
    size: 120,
  }),
  columnHelper.accessor((row) => row.children?.length ?? 0, {
    id: 'childCount',
    header: 'Children',
    size: 100,
    meta: {
      align: 'right' as const,
    },
  }),
]

export const TableTree = () => {
  const [compact, setCompact] = useState(false)
  const [enableRowSelection, setEnableRowSelection] = useState(false)

  return (
    <Page title='Table - Tree'>
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
        </Box>
      </Box>
      <Box
        sx={[
          {
            p: 2,
            display: 'flex',
            flexDirection: 'column',
            flex: '1 1 auto',
            minHeight: 0,
            height: '640px',
          },
        ]}
      >
        <Table<TreeDemoRow>
          title='Table - Tree'
          name='table-tree-demo'
          keyField='id'
          columns={columns}
          data={treeRows}
          disableStatePersistence
          enableTreeBehavior
          enableGrouping={false}
          enableRowSelection={enableRowSelection}
          enableColumnFilters={false}
          enableGlobalFilter={false}
          enableFilters={false}
          getSubRows={(row) => row.children}
          getRowCanExpand={(row) => (row.original.children?.length ?? 0) > 0}
          initialState={{
            expanded: expandedRows,
            pagination: {
              pageIndex: 0,
              pageSize: 25,
            },
            sorting: [],
          }}
          displayPagination='never'
          scrollBehavior='bounded'
          useVirtualRows={false}
          compact={compact}
          debug={false}
        />
      </Box>
    </Page>
  )
}
