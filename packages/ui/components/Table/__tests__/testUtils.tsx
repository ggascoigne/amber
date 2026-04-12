/* eslint-disable import/no-extraneous-dependencies */

import type { PropsWithChildren, ReactElement, ReactNode } from 'react'
import { useState } from 'react'

import { CssBaseline, ThemeProvider } from '@mui/material'
import Box from '@mui/material/Box'
import type { ColumnDef, Row, RowData } from '@tanstack/react-table'
import { render } from '@testing-library/react'
import { vi } from 'vitest'

import { theme } from '../../../components/Theme'
import { DataTable } from '../DataTable'
import type { DataTableEditingConfig, TableEditRowUpdate } from '../editing/types'
import { Table } from '../Table'
import { useTable } from '../useTable'

export type PersonRow = {
  id: string
  name: string
  age: number
  note?: string
  isNew?: boolean
}

export const personColumns: Array<ColumnDef<PersonRow>> = [
  {
    accessorKey: 'name',
    header: 'Name',
    meta: {
      edit: {
        type: 'text',
      },
    },
  },
  {
    accessorKey: 'age',
    header: 'Age',
    meta: {
      align: 'right',
      edit: {
        type: 'number',
      },
    },
  },
]

const TestProviders = ({ children }: PropsWithChildren): ReactElement => (
  <ThemeProvider theme={theme}>
    <CssBaseline />
    {children}
  </ThemeProvider>
)

export const renderWithProviders = (ui: ReactNode) => render(<TestProviders>{ui}</TestProviders>)

export const installDomMeasurementMocks = () => {
  class ResizeObserverMock {
    public observe = () => this

    public unobserve = () => this

    public disconnect = () => this
  }

  vi.stubGlobal('ResizeObserver', ResizeObserverMock)
  vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => window.setTimeout(() => callback(0), 0))
  vi.stubGlobal('cancelAnimationFrame', (handle: number) => window.clearTimeout(handle))

  if (!Element.prototype.scrollTo) {
    Object.defineProperty(Element.prototype, 'scrollTo', {
      configurable: true,
      value: function scrollTo(options?: ScrollToOptions | number, y?: number) {
        if (typeof options === 'number') {
          ;(this as Element & { scrollLeft: number; scrollTop: number }).scrollLeft = options
          ;(this as Element & { scrollLeft: number; scrollTop: number }).scrollTop = y ?? 0
          return
        }

        ;(this as Element & { scrollLeft: number; scrollTop: number }).scrollLeft = options?.left ?? 0
        ;(this as Element & { scrollLeft: number; scrollTop: number }).scrollTop = options?.top ?? 0
      },
    })
  }

  vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function getBoundingClientRect(
    this: HTMLElement,
  ) {
    const element = this as HTMLElement
    const explicitHeight = element.dataset.testHeight ? Number(element.dataset.testHeight) : undefined
    const height =
      explicitHeight ??
      (element.dataset.testid === 'table-scroll-container' ? 320 : element.dataset.testid === 'TableRow' ? 34 : 40)

    return {
      width: 1200,
      height,
      top: 0,
      left: 0,
      right: 1200,
      bottom: height,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    } as DOMRect
  })
}

type DataTableHarnessProps<TData extends RowData> = {
  data: Array<TData>
  columns: Array<ColumnDef<TData>>
  cellEditing?: DataTableEditingConfig<TData>
  rowCount?: number
  useVirtualRows?: boolean
  renderExpandedContent?: (row: Row<TData>) => ReactNode
  showExpandedSwitch?: boolean
  showExpandedOnly?: boolean
  title?: string
}

export const DataTableHarness = <TData extends RowData>({
  data,
  columns,
  cellEditing,
  rowCount,
  useVirtualRows,
  renderExpandedContent,
  showExpandedSwitch,
  showExpandedOnly,
  title,
}: DataTableHarnessProps<TData>) => {
  const [rows, setRows] = useState(data)
  const table = useTable<TData>({
    keyField: 'id' as keyof TData,
    columns,
    data: rows,
    enablePagination: true,
    enableRowSelection: true,
    getRowCanExpand: renderExpandedContent ? () => true : undefined,
    initialState: {
      pagination: {
        pageIndex: 0,
        pageSize: rows.length,
      },
    },
  })

  const resolvedEditing =
    cellEditing && cellEditing.onSave
      ? {
          ...cellEditing,
          onSave: async (updates: Array<TableEditRowUpdate<TData>>) => {
            await cellEditing.onSave(updates)
            setRows((currentRows) =>
              currentRows.map((row) => {
                const update = updates.find((candidate) => candidate.rowId === String((row as { id: string }).id))
                return update ? update.updated : row
              }),
            )
          },
        }
      : cellEditing

  return (
    <Box sx={{ height: 400, width: 1000 }}>
      <DataTable
        title={title}
        tableInstance={table}
        cellEditing={resolvedEditing}
        useVirtualRows={useVirtualRows}
        scrollBehavior='bounded'
        renderExpandedContent={renderExpandedContent}
        showExpandedSwitch={showExpandedSwitch}
        showExpandedOnly={showExpandedOnly}
        rowCount={rowCount}
        dataTestid='table-scroll-container'
        compact
      />
    </Box>
  )
}

type TableHarnessProps = {
  data?: Array<PersonRow>
  renderExpandedContent?: (row: Row<PersonRow>) => ReactNode
  cellEditing?: DataTableEditingConfig<PersonRow>
  showExpandedSwitch?: boolean
  showExpandedOnly?: boolean
  onShowExpandedOnlyChange?: (nextValue: boolean) => void
}

export const TableHarness = ({
  data = [
    { id: '1', name: 'Alpha', age: 10, note: 'alpha details' },
    { id: '2', name: 'Beta', age: 20, note: 'beta details' },
  ],
  renderExpandedContent,
  cellEditing,
  showExpandedSwitch,
  showExpandedOnly,
  onShowExpandedOnlyChange,
}: TableHarnessProps) => (
  <Box sx={{ height: 400, width: 1000 }}>
    <Table<PersonRow>
      disableStatePersistence
      data={data}
      columns={personColumns}
      keyField='id'
      title='People'
      enableRowSelection
      useVirtualRows
      cellEditing={cellEditing}
      renderExpandedContent={renderExpandedContent}
      showExpandedSwitch={showExpandedSwitch}
      showExpandedOnly={showExpandedOnly}
      onShowExpandedOnlyChange={onShowExpandedOnlyChange}
      scrollBehavior='bounded'
    />
  </Box>
)
