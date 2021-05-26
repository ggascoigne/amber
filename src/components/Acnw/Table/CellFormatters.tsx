import { DateTime } from 'luxon'
import React from 'react'
import { CellProps } from 'react-table'

import { TooltipCell } from './TooltipCellRenderer'

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

export const getBooleanCell =
  (valueMapping: Record<any, string>) =>
  ({ cell: { value }, column: { align = 'left' } }: CellProps<any>) => {
    const val = valueMapping[value]
    return <TooltipCell text={val} align={align} />
  }

export const YesNoCell: React.FC<CellProps<any>> = getBooleanCell({ true: 'Yes', false: 'No' })

export const YesBlankCell: React.FC<CellProps<any>> = getBooleanCell({ true: 'Yes', false: '' })

export const BlankNoCell: React.FC<CellProps<any>> = getBooleanCell({ true: '', false: 'No' })
