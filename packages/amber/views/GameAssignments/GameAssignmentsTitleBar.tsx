import type { MouseEvent } from 'react'

import { Box, Button, ToggleButton, ToggleButtonGroup } from '@mui/material'

import { CollapsibleInfoPanel } from './CollapsibleInfoPanel'
import type { GameAssignmentsLayoutMode } from './pageState'
import { SlotFilterSelect } from './SlotFilterSelect'

const legendItems = [
  'Members with a * by their name have Signup notes',
  'Red names have incomplete Signups or Assignments.',
  'Priorities with a * by them are returning players.',
  'Game names with a * by them are returning players only.',
]

type GameAssignmentsTitleBarProps = {
  slotFilterOptions: Array<number>
  slotFilterId: number | null | 'mixed'
  onSlotFilterChange: (slotFilterId: number | null) => void
  layoutMode: GameAssignmentsLayoutMode
  onLayoutChange: (event: MouseEvent<HTMLElement>, nextLayout: GameAssignmentsLayoutMode | null) => void
  onResetAssignments: () => void
  onSetInitialAssignments: () => void
  onShowSummary: () => void
  isBusy: boolean
  isSummaryBusy: boolean
}

export const GameAssignmentsTitleBar = ({
  slotFilterOptions,
  slotFilterId,
  onSlotFilterChange,
  layoutMode,
  onLayoutChange,
  onResetAssignments,
  onSetInitialAssignments,
  onShowSummary,
  isBusy,
  isSummaryBusy,
}: GameAssignmentsTitleBarProps) => (
  <Box
    sx={{
      px: 3,
      pt: 2.5,
      pb: 1.25,
      display: 'flex',
      flexDirection: { xs: 'column', md: 'row' },
      alignItems: { xs: 'flex-start', md: 'flex-start' },
      justifyContent: 'space-between',
      gap: 2,
    }}
  >
    <Box
      sx={{
        fontSize: '2.25rem',
        lineHeight: '1.5em',
        fontWeight: 300,
        color: 'inherit',
        m: 0,
      }}
      component='h1'
    >
      Game Assignments
    </Box>
    <Box
      sx={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 2,
        flexWrap: 'wrap',
        justifyContent: 'flex-end',
      }}
    >
      <SlotFilterSelect
        slotFilterOptions={slotFilterOptions}
        slotFilterId={slotFilterId}
        onSlotFilterChange={onSlotFilterChange}
        allowMixedState
      />
      <ToggleButtonGroup
        value={layoutMode}
        exclusive
        onChange={onLayoutChange}
        size='small'
        aria-label='Layout'
        sx={{
          display: { xs: 'none', md: 'inline-flex' },
          '& .MuiToggleButton-root': {
            py: 0.25,
            px: 1.25,
            minHeight: 30,
            lineHeight: 1.2,
          },
        }}
      >
        <ToggleButton value='grid' aria-label='Grid layout'>
          Grid
        </ToggleButton>
        <ToggleButton value='columns' aria-label='Column layout'>
          Columns
        </ToggleButton>
      </ToggleButtonGroup>
      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, flexWrap: 'wrap' }}>
        <Button variant='outlined' size='small' onClick={onShowSummary} disabled={isSummaryBusy}>
          Show Summary
        </Button>
        <Button variant='outlined' size='small' onClick={onResetAssignments} disabled={isBusy}>
          Reset Assignments
        </Button>
        <Button variant='outlined' size='small' onClick={onSetInitialAssignments} disabled={isBusy}>
          Set Initial Assignments
        </Button>
      </Box>
      <CollapsibleInfoPanel
        defaultCollapsed={false}
        expandAriaLabel='Expand legend'
        collapseAriaLabel='Collapse legend'
        rootSx={{
          border: (styleTheme) => `1px solid ${styleTheme.palette.divider}`,
          borderRadius: 1,
          px: 2,
          backgroundColor: 'background.default',
          '& .MuiIconButton-root': {
            p: 0.5,
          },
        }}
        collapsedSx={{
          py: 0.25,
          minHeight: 30,
          fontSize: '0.75rem',
          lineHeight: 1.4,
          maxWidth: { xs: '100%', md: 220 },
        }}
        expandedSx={{
          py: 1,
          maxWidth: { xs: '100%', md: 380 },
        }}
        collapsedContent={
          <Box component='span' sx={{ whiteSpace: 'nowrap', fontSize: '0.75rem', lineHeight: 1.4 }}>
            Legend
          </Box>
        }
        expandedContent={
          <Box
            component='ul'
            sx={{
              m: 0,
              pl: 2.25,
              display: 'flex',
              flexDirection: 'column',
              gap: 0.5,
              fontSize: '0.75rem',
              lineHeight: 1.4,
            }}
          >
            {legendItems.map((item) => (
              <Box component='li' key={item}>
                {item}
              </Box>
            ))}
          </Box>
        }
      />
    </Box>
  </Box>
)
