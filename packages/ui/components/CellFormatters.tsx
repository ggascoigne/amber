import React from 'react'

import { DateTime } from 'luxon'
import { CellProps } from 'react-table'

import { TooltipCell } from './Table/TooltipCellRenderer'

export const DateCell = <T extends Record<string, unknown>>({
  cell: { value },
  column: { align = 'left', dateFormat = 'EEE, MMM d' },
}: CellProps<T>) => {
  const dateTime = value instanceof Date ? DateTime.fromJSDate(value) : DateTime.fromISO(value)
  return (
    <TooltipCell
      text={dateTime.toFormat(dateFormat)}
      tooltip={dateTime.toLocaleString(DateTime.DATE_HUGE)}
      align={align}
    />
  )
}

export const YesNoCell = <T extends Record<string, unknown>>({
  cell: { value },
  column: { align = 'left' },
}: CellProps<T>) => {
  const val = value ? 'Yes' : 'No'
  return <TooltipCell text={val} align={align} />
}

export const YesBlankCell = <T extends Record<string, unknown>>({
  cell: { value },
  column: { align = 'left' },
}: CellProps<T>) => {
  const val = value ? 'Yes' : ''
  return <TooltipCell text={val} align={align} />
}

export const BlankNoCell = <T extends Record<string, unknown>>({
  cell: { value },
  column: { align = 'left' },
}: CellProps<T>) => {
  const val = value ? '' : 'No'
  return <TooltipCell text={val} align={align} />
}
