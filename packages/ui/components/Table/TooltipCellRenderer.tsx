import React, { useCallback, useRef, useState } from 'react'

import { Box, PopperProps, Tooltip } from '@mui/material'
import type { CellProps } from 'react-table'

import { CellEditorWrapper } from './CellEditor'

interface TooltipCellProps {
  text: string
  tooltip?: string
  align: string
  onClick?: (event: React.MouseEvent<HTMLElement>) => void
}

export const TooltipCell: React.FC<TooltipCellProps> = ({ text = '', tooltip = text || '', align, onClick }) => {
  const [isOverflowed, setIsOverflow] = useState(false)
  const [open, setOpen] = useState(false)
  const textRef = useRef<HTMLSpanElement>(null)

  const compareSize = () => {
    setIsOverflow(!!(textRef?.current && textRef.current?.scrollWidth > textRef.current?.clientWidth))
  }

  const enableTooltip = text !== tooltip || isOverflowed

  return (
    <Tooltip
      sx={{
        textOverflow: 'ellipsis',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        textAlign: align,
        width: '100%',
      }}
      title={tooltip}
      disableHoverListener={!enableTooltip}
      open={open}
      onOpen={() => {
        if (enableTooltip) {
          setOpen(true)
        }
      }}
      onClose={() => {
        setOpen(false)
      }}
    >
      <Box ref={textRef} onMouseEnter={compareSize} onClick={onClick}>
        {text}
      </Box>
    </Tooltip>
  )
}

// TooltipCell.whyDidYouRender = true

export const EditableCell: React.FC<CellProps<any>> = (props) => {
  const { row, updateData, cell, column } = props
  const { align = 'left' } = column
  const [anchorEl, setAnchorEl] = React.useState<PopperProps['anchorEl']>(null)

  const onClick = useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      setAnchorEl(anchorEl ? null : event.currentTarget)
    },
    [anchorEl],
  )

  return (
    <>
      <TooltipCell text={cell.value} align={align} onClick={onClick} />
      <CellEditorWrapper
        column={column}
        rowIndex={row.index}
        updateData={updateData!}
        value={cell.value}
        onClose={() => setAnchorEl(null)}
        anchorElement={anchorEl}
      />
    </>
  )
}

export const TooltipCellRenderer: React.FC<CellProps<any>> = (props) => {
  const { updateData, cell, column } = props
  const { align = 'left' } = column
  return updateData ? <EditableCell {...props} /> : <TooltipCell text={cell.value} align={align} />
}
