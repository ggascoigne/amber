import React from 'react'

import { DateTime } from 'luxon'

import { TooltipCell, getCellSx } from './Table'
import type { CellContext, RowData } from './Table/tableTypes'

const getDateFormat = <T extends RowData>({ column }: CellContext<T, unknown>): string =>
  column.columnDef.meta?.dateFormat ?? 'EEE, MMM d'

export const DateCell = <T extends RowData>(props: CellContext<T, unknown>) => {
  const value = props.getValue() as string | Date | null | undefined
  if (!value) {
    return <TooltipCell text='' sx={getCellSx(props)} />
  }

  const dateTime = value instanceof Date ? DateTime.fromJSDate(value) : DateTime.fromISO(String(value))

  return (
    <TooltipCell
      text={dateTime.toFormat(getDateFormat(props))}
      tooltip={dateTime.toLocaleString(DateTime.DATE_HUGE)}
      sx={getCellSx(props)}
    />
  )
}

export const YesNoCell = <T extends RowData>(props: CellContext<T, unknown>) => {
  const val = props.getValue() ? 'Yes' : 'No'
  return <TooltipCell text={val} sx={getCellSx(props)} />
}

export const YesBlankCell = <T extends RowData>(props: CellContext<T, unknown>) => {
  const val = props.getValue() ? 'Yes' : ''
  return <TooltipCell text={val} sx={getCellSx(props)} />
}

export const BlankNoCell = <T extends RowData>(props: CellContext<T, unknown>) => {
  const val = props.getValue() ? '' : 'No'
  return <TooltipCell text={val} sx={getCellSx(props)} />
}
