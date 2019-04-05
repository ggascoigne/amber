import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider'
import MUIDataTable, { MUIDataTableOptions, MUIDataTableProps } from 'mui-datatables'
import React, { MouseEventHandler } from 'react'

import { CustomToolbar } from './CustomToolbar'
import { CustomToolbarSelect } from './CustomToolbarSelect'
import { getMuiTableTheme } from './getTableTheme'
import { ITableSelectedRows } from './types'

export interface ITable extends MUIDataTableProps {
  onAdd: MouseEventHandler
  onDelete: (selection: ITableSelectedRows) => void
  onEdit: (selection: ITableSelectedRows) => void
}

export const Table: React.FC<ITable> = ({ title, data, columns, onAdd, onDelete, onEdit }) => {
  const options: MUIDataTableOptions = {
    filterType: 'checkbox',
    download: false,
    print: false,
    responsive: 'stacked',
    customToolbar: () => {
      return <CustomToolbar onAdd={onAdd} />
    },
    customToolbarSelect: (selectedRows, displayData, setSelectedRows) => (
      <CustomToolbarSelect
        selectedRows={selectedRows}
        displayData={displayData}
        setSelectedRows={setSelectedRows}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    )
  }

  return (
    <MuiThemeProvider theme={getMuiTableTheme()}>
      <MUIDataTable title={title} data={data} columns={columns} options={options} />
    </MuiThemeProvider>
  )
}
