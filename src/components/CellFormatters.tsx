import { DateTime } from 'luxon'
import React from 'react'
import { CellProps } from 'react-table'

import { TooltipCell } from './Table/TooltipCellRenderer'

export const DateCell = <T extends Record<string, unknown>>({
  cell: { value },
  column: { align = 'left', dateFormat = 'EEE, MMM d' },
}: CellProps<T>) => (
  <TooltipCell
    text={DateTime.fromISO(value).toFormat(dateFormat)}
    tooltip={DateTime.fromISO(value).toLocaleString(DateTime.DATE_HUGE)}
    align={align}
  />
)

export const YesNoCell = <T extends Record<string, unknown>>({
  cell: { value },
  column: { align = 'left' },
}: CellProps<T>) => {
  const val = !!value ? 'Yes' : 'No'
  return <TooltipCell text={val} align={align} />
}

export const YesBlankCell = <T extends Record<string, unknown>>({
  cell: { value },
  column: { align = 'left' },
}: CellProps<T>) => {
  const val = !!value ? 'Yes' : ''
  return <TooltipCell text={val} align={align} />
}

export const BlankNoCell = <T extends Record<string, unknown>>({
  cell: { value },
  column: { align = 'left' },
}: CellProps<T>) => {
  const val = !!value ? '' : 'No'
  return <TooltipCell text={val} align={align} />
}
