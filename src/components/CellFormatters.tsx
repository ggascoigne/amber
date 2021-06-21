import { DateTime } from 'luxon'
import React from 'react'
import { CellProps } from 'react-table'

import { TooltipCell } from './Table/TooltipCellRenderer'

export const DateCell: React.FC<CellProps<any>> = ({
  cell: { value },
  column: { align = 'left', dateFormat = 'EEE, MMM d' },
}) => (
  <TooltipCell
    text={DateTime.fromISO(value).toFormat(dateFormat)}
    tooltip={DateTime.fromISO(value).toLocaleString(DateTime.DATE_HUGE)}
    align={align}
  />
)

export const YesNoCell: React.FC<CellProps<any>> = ({
  cell: { value },
  column: { align = 'left' },
}: CellProps<any>) => {
  const val = !!value ? 'Yes' : 'No'
  return <TooltipCell text={val} align={align} />
}

export const YesBlankCell: React.FC<CellProps<any>> = ({
  cell: { value },
  column: { align = 'left' },
}: CellProps<any>) => {
  const val = !!value ? 'Yes' : ''
  return <TooltipCell text={val} align={align} />
}

export const BlankNoCell: React.FC<CellProps<any>> = ({
  cell: { value },
  column: { align = 'left' },
}: CellProps<any>) => {
  const val = !!value ? '' : 'No'
  return <TooltipCell text={val} align={align} />
}
