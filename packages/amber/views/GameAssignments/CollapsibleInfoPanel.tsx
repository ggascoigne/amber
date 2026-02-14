import type { ReactNode } from 'react'
import { useEffect, useRef, useState } from 'react'

import UnfoldLessIcon from '@mui/icons-material/UnfoldLess'
import UnfoldMoreIcon from '@mui/icons-material/UnfoldMore'
import { Box, IconButton } from '@mui/material'
import type { SxProps, Theme } from '@mui/material/styles'

type CollapsibleInfoPanelProps = {
  collapsedContent: ReactNode
  expandedContent: ReactNode
  defaultCollapsed?: boolean
  expandAriaLabel?: string
  collapseAriaLabel?: string
  toggleVisibility?: 'always' | 'auto'
  fillContainer?: boolean
  rootSx?: SxProps<Theme>
  collapsedSx?: SxProps<Theme>
  expandedSx?: SxProps<Theme>
}

export const CollapsibleInfoPanel = ({
  collapsedContent,
  expandedContent,
  defaultCollapsed = false,
  expandAriaLabel = 'Expand',
  collapseAriaLabel = 'Collapse',
  toggleVisibility = 'always',
  fillContainer = false,
  rootSx,
  collapsedSx,
  expandedSx,
}: CollapsibleInfoPanelProps) => {
  const [collapsed, setCollapsed] = useState(defaultCollapsed)
  const [showToggle, setShowToggle] = useState(toggleVisibility === 'always')
  const [collapsedWidth, setCollapsedWidth] = useState(0)
  const collapsedContentRef = useRef<HTMLDivElement | null>(null)
  const expandedMeasureRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    let resizeObserver: ResizeObserver | null = null
    if (toggleVisibility === 'always') {
      setShowToggle(true)
    } else {
      const measure = () => {
        const collapsedElement = collapsedContentRef.current
        const expandedMeasureElement = expandedMeasureRef.current

        if (!collapsedElement || !expandedMeasureElement) return

        const nextCollapsedWidth = Math.round(collapsedElement.clientWidth)
        if (nextCollapsedWidth > 0 && nextCollapsedWidth !== collapsedWidth) {
          setCollapsedWidth(nextCollapsedWidth)
        }

        const hasMoreContent =
          expandedMeasureElement.scrollHeight > collapsedElement.clientHeight + 1 ||
          expandedMeasureElement.scrollWidth > collapsedElement.clientWidth + 1

        setShowToggle(hasMoreContent)
      }

      measure()

      if (typeof ResizeObserver !== 'undefined') {
        resizeObserver = new ResizeObserver(measure)
        if (collapsedContentRef.current) resizeObserver.observe(collapsedContentRef.current)
        if (expandedMeasureRef.current) resizeObserver.observe(expandedMeasureRef.current)
      }
    }

    return () => {
      resizeObserver?.disconnect()
    }
  }, [collapsedWidth, expandedContent, collapsedContent, toggleVisibility])

  useEffect(() => {
    if (toggleVisibility === 'auto' && !showToggle && !collapsed) {
      setCollapsed(true)
    }
  }, [toggleVisibility, showToggle, collapsed])

  const showCollapsedContent = collapsed || !showToggle

  return (
    <Box
      sx={[
        {
          position: 'relative',
          minWidth: 0,
          ...(fillContainer ? { width: '100%', overflow: 'hidden' } : {}),
        },
        ...(Array.isArray(rootSx) ? rootSx : [rootSx]),
      ]}
    >
      {toggleVisibility === 'auto' ? (
        <Box
          ref={expandedMeasureRef}
          aria-hidden
          sx={{
            position: 'absolute',
            visibility: 'hidden',
            pointerEvents: 'none',
            zIndex: -1,
            minWidth: 0,
            width: collapsedWidth > 0 ? `${collapsedWidth}px` : '100%',
            overflow: 'visible',
          }}
        >
          {expandedContent}
        </Box>
      ) : null}
      {showCollapsedContent ? (
        <Box
          sx={[
            {
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              ...(fillContainer ? { width: '100%' } : {}),
              minWidth: 0,
            },
            ...(Array.isArray(collapsedSx) ? collapsedSx : [collapsedSx]),
          ]}
        >
          <Box ref={collapsedContentRef} sx={{ flex: 1, minWidth: 0 }}>
            {collapsedContent}
          </Box>
          {showToggle ? (
            <IconButton aria-label={expandAriaLabel} size='small' onClick={() => setCollapsed(false)}>
              <UnfoldMoreIcon fontSize='small' />
            </IconButton>
          ) : null}
        </Box>
      ) : (
        <Box
          sx={[
            {
              display: 'flex',
              alignItems: 'flex-start',
              gap: 1,
              ...(fillContainer ? { width: '100%' } : {}),
              minWidth: 0,
            },
            ...(Array.isArray(expandedSx) ? expandedSx : [expandedSx]),
          ]}
        >
          <Box sx={{ flex: 1, minWidth: 0 }}>{expandedContent}</Box>
          {showToggle ? (
            <IconButton aria-label={collapseAriaLabel} size='small' onClick={() => setCollapsed(true)}>
              <UnfoldLessIcon fontSize='small' />
            </IconButton>
          ) : null}
        </Box>
      )}
    </Box>
  )
}
