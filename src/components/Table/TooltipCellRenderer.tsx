import { Tooltip, makeStyles } from '@material-ui/core'
import React, { CSSProperties, useRef, useState } from 'react'
import type { CellProps } from 'react-table'

const useStyles = makeStyles({
  truncated: {
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
  },
})

export const TooltipCellRenderer: React.FC<CellProps<any>> = ({ cell: { value }, column: { align = 'left' } }) => (
  <TooltipCell text={value} align={align} />
)

interface TooltipProps {
  text: string
  tooltip?: string
  align: string
}

export const TooltipCell: React.FC<TooltipProps> = ({ text = '', tooltip = text || '', align }) => {
  const classes = useStyles({})
  const [isOverflowed, setIsOverflow] = useState(false)
  const textRef = useRef<HTMLSpanElement>(null)

  const compareSize = () => {
    setIsOverflow(!!(textRef?.current && textRef.current?.scrollWidth > textRef.current?.clientWidth))
  }

  const showTooltip = text !== tooltip || isOverflowed

  return (
    <Tooltip
      className={classes.truncated}
      style={{ textAlign: align } as CSSProperties}
      title={tooltip}
      disableHoverListener={!showTooltip}
    >
      <span ref={textRef} onMouseEnter={compareSize}>
        {text}
      </span>
    </Tooltip>
  )
}
