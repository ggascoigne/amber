import type { ReactElement } from 'react'
import { useMemo } from 'react'

import Box from '@mui/material/Box'
import type { Row, RowData } from '@tanstack/react-table'

import { RowExpansionButton } from '../components/RowExpansionButton'

export const treeLineTypes = {
  vertical: '|',
  middleCorner: '+',
  lastCorner: '-',
  middleExpansion: '*',
  lastExpansion: '\\',
  space: '_',
} as const

export type TreeLineType = (typeof treeLineTypes)[keyof typeof treeLineTypes]

export const treeIndentLevel = 32

const svgSegmentSize = 32
const svgSegmentCenter = svgSegmentSize / 2
const svgHorizontalStartOffset = 1
const svgHorizontalLength = svgSegmentSize * 0.3
const svgExpansionButtonGapStart = 22.5
const svgExpansionButtonGapEnd = 76.5

const treeLineRailSx = {
  flex: '0 0 auto',
  position: 'relative',
  height: '100%',
}

const treeLineSvgSx = {
  position: 'absolute',
  inset: 'calc(-1 * var(--table-compact-spacing)) 0',
  width: '100%',
  height: 'calc(100% + calc(2 * var(--table-compact-spacing)))',
  color: 'divider',
  '--table-tree-line-color': 'currentColor',
  pointerEvents: 'none',
}

const treeLineExpansionButtonSx = {
  position: 'absolute',
  top: '50%',
  width: 24,
  minWidth: 24,
  height: 24,
  borderRadius: '50%',
  zIndex: 1,
  margin: 0,
  overflow: 'hidden',
}

const getRailWidth = (segmentCount: number) => `calc(${segmentCount} * var(--table-tree-indent-level))`

const getSegmentX = (index: number) => index * svgSegmentSize + svgSegmentCenter

const getSegmentPaths = (detail: TreeLineType, index: number): Array<string> => {
  const x = getSegmentX(index)
  const horizontalStart = x + svgHorizontalStartOffset - 1
  const horizontal = `M ${horizontalStart} 50 H ${horizontalStart + svgHorizontalLength}`

  switch (detail) {
    case treeLineTypes.vertical:
      return [`M ${x} 0 V 100`]
    case treeLineTypes.middleCorner:
      return [`M ${x} 0 V 100`, horizontal]
    case treeLineTypes.lastCorner:
      return [`M ${x} 0 V 50`, horizontal]
    case treeLineTypes.middleExpansion:
      return [`M ${x} 0 V ${svgExpansionButtonGapStart}`, `M ${x} ${svgExpansionButtonGapEnd} V 100`]
    case treeLineTypes.lastExpansion:
      return [`M ${x} 0 V ${svgExpansionButtonGapStart}`]
    case treeLineTypes.space:
      return []
    default:
      return []
  }
}

type TreeLinesProps<TData extends RowData> = {
  expansionDetails: Array<TreeLineType>
  row: Row<TData>
}

export const TreeLines = <TData extends RowData>({
  expansionDetails,
  row,
}: TreeLinesProps<TData>): ReactElement | null => {
  const segmentCount = expansionDetails.length
  const paths = useMemo(
    () => expansionDetails.flatMap((detail, index) => getSegmentPaths(detail, index)),
    [expansionDetails],
  )

  if (!segmentCount) return null

  const railWidth = getRailWidth(segmentCount)
  const expansionIndex = expansionDetails.findIndex(
    (detail) => detail === treeLineTypes.middleExpansion || detail === treeLineTypes.lastExpansion,
  )

  return (
    <Box
      component='span'
      data-testid='TreeLineRail'
      data-tree-line-segments={expansionDetails.join('')}
      sx={[
        treeLineRailSx,
        {
          width: railWidth,
          minWidth: railWidth,
        },
      ]}
    >
      {paths.length > 0 ? (
        <Box
          component='svg'
          aria-hidden='true'
          data-testid='TreeLineSvg'
          focusable='false'
          viewBox={`0 0 ${segmentCount * svgSegmentSize} 100`}
          preserveAspectRatio='none'
          sx={treeLineSvgSx}
        >
          {paths.map((path, index) => (
            <path
              key={`${path}-${index}`}
              className='tableTreeLinePath'
              d={path}
              fill='none'
              stroke='var(--table-tree-line-color)'
              strokeWidth='1'
              vectorEffect='non-scaling-stroke'
              shapeRendering='crispEdges'
            />
          ))}
        </Box>
      ) : null}
      {expansionIndex >= 0 ? (
        <RowExpansionButton
          row={row}
          sx={[
            treeLineExpansionButtonSx,
            {
              left: `calc(${expansionIndex} * var(--table-tree-indent-level) + ((var(--table-tree-indent-level) - 24px) / 2))`,
              transform: 'translateY(-50%)',
            },
          ]}
        />
      ) : null}
    </Box>
  )
}
