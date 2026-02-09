import type { ReactElement, MouseEvent } from 'react'
import { useState, useCallback } from 'react'

import { ViewColumn as ViewColumnsIcon, Close as CloseIcon } from '@mui/icons-material'
import {
  Box,
  Checkbox,
  FormControlLabel,
  IconButton as NsIconButton,
  Popover,
  Tooltip,
  Typography,
} from '@mui/material'
import type { RowData, Table as TableInstance } from '@tanstack/react-table'

import { TableIconButton } from './ToolbarButtons'

import { columnName, isUserColumnId } from '../utils/tableUtils'

type ColumnSelectorPopupProps<T extends RowData> = {
  table: TableInstance<T>
  anchorEl?: Element
  onClose: () => void
  show: boolean
  anchorDirection: 'top-left' | 'top-right'
}

const id = 'popover-column-hide'

export function ColumnSelectorPopup<T extends RowData>({
  table,
  anchorEl,
  onClose,
  show,
  anchorDirection,
}: ColumnSelectorPopupProps<T>): ReactElement | null {
  const relevantColumns = table.getAllLeafColumns().filter((column) => isUserColumnId(column.id))
  const checkedCount = relevantColumns.reduce((acc, val) => acc + (val.getIsVisible() ? 0 : 1), 0)
  const onlyOneOptionLeft = checkedCount + 1 >= relevantColumns.length

  return relevantColumns.length > 1 ? (
    <Popover
      anchorEl={anchorEl}
      sx={{ p: 4 }}
      id={id}
      onClose={onClose}
      open={show}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      transformOrigin={
        anchorDirection === 'top-left'
          ? {
              vertical: 'top',
              horizontal: 'left',
            }
          : {
              vertical: 'top',
              horizontal: 'right',
            }
      }
    >
      <Box sx={{ p: 4 }}>
        <Tooltip title='Close' aria-label='Close'>
          <NsIconButton
            data-testid='close-button'
            aria-label='Close'
            onClick={onClose}
            sx={{
              position: 'absolute',
              top: (theme) => theme.spacing(1),
              right: (theme) => theme.spacing(1),
            }}
          >
            <CloseIcon />
          </NsIconButton>
        </Tooltip>
        <Typography
          sx={{
            fontWeight: 500,
            padding: '0 24px 24px 0',
            textTransform: 'uppercase',
          }}
        >
          Visible Columns
        </Typography>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 198px)',
            '@media (max-width: 600px)': {
              gridTemplateColumns: 'repeat(1, 160px)',
            },
            gridColumnGap: 6,
            gridRowGap: 6,
          }}
        >
          {relevantColumns.map((column) => (
            <FormControlLabel
              key={column.id}
              control={<Checkbox value={`${column.id}`} disabled={column.getIsVisible() && onlyOneOptionLeft} />}
              // note that this isn't really correct, but react-table removes invisible
              // headers, as such there's no way to get a valid context for a hidden column
              // faking it leaves a header context that is still missing information needed to provide a valid
              // interface.  This is at least predictable
              label={columnName(column)}
              checked={column.getIsVisible()}
              onChange={column.getToggleVisibilityHandler()}
            />
          ))}
        </Box>
      </Box>
    </Popover>
  ) : null
}

type ColumnSelectorProps<T extends RowData> = {
  table: TableInstance<T>
  anchorDirection: 'top-left' | 'top-right'
}

export const ColumnSelector = <T extends RowData>({ table, anchorDirection }: ColumnSelectorProps<T>) => {
  const [anchorEl, setAnchorEl] = useState<Element | undefined>(undefined)
  const [columnsOpen, setColumnsOpen] = useState(false)
  const relevantColumns = table.getAllLeafColumns().filter((column) => isUserColumnId(column.id))

  const handleButtonClick = useCallback(
    (event: MouseEvent) => {
      setAnchorEl(event.currentTarget)
      setColumnsOpen(true)
    },
    [setAnchorEl, setColumnsOpen],
  )

  const handleClose = useCallback(() => {
    setColumnsOpen(false)
    setAnchorEl(undefined)
  }, [])

  return relevantColumns.length > 1 ? (
    <>
      <TableIconButton icon={<ViewColumnsIcon />} onClick={handleButtonClick} label='Settings' />
      <ColumnSelectorPopup
        table={table}
        onClose={handleClose}
        show={columnsOpen}
        anchorEl={anchorEl}
        anchorDirection={anchorDirection}
      />
    </>
  ) : null
}
