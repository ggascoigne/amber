import type { MouseEvent, SyntheticEvent } from 'react'

import {
  Box,
  Button,
  FormControl,
  MenuItem,
  Tab,
  Tabs,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material'

import type {
  RoomAssignmentsAssignmentLayoutMode,
  RoomAssignmentsSetupLayoutMode,
  RoomAssignmentsTabId,
} from './pageState'

import { CollapsibleInfoPanel } from '../GameAssignments/CollapsibleInfoPanel'

const workflowLegendItems = [
  'Calculate replaces non-override room assignments across the schedule and keeps override rows fixed.',
  'Calculate for This Slot only recalculates the visible slot and leaves override rows fixed.',
  'Reset Room Assignments clears both default and override room assignments for the year.',
  'Override rooms now take priority when syncing the display/report room into game.room_id.',
  'Download Details exports the latest calculation result from this page session.',
]

type ExplicitSlotFilterSelectProps = {
  slotFilterOptions: Array<number>
  slotFilterId: number
  onSlotFilterChange: (slotFilterId: number) => void
}

const ExplicitSlotFilterSelect = ({
  slotFilterOptions,
  slotFilterId,
  onSlotFilterChange,
}: ExplicitSlotFilterSelectProps) => (
  <FormControl sx={{ minWidth: 110 }}>
    <TextField
      select
      size='small'
      variant='standard'
      value={`${slotFilterId}`}
      onChange={(event) => {
        const nextValue = Number(event.target.value)
        if (!Number.isInteger(nextValue)) {
          return
        }

        onSlotFilterChange(nextValue)
      }}
      aria-label='Slot filter'
    >
      {slotFilterOptions.map((slotValue) => (
        <MenuItem key={slotValue} value={`${slotValue}`}>
          {`Slot ${slotValue}`}
        </MenuItem>
      ))}
    </TextField>
  </FormControl>
)

type RoomAssignmentsPageChromeProps = {
  activeTab: RoomAssignmentsTabId
  onTabChange: (nextTab: RoomAssignmentsTabId) => void
  assignmentSlotFilterId: number
  slotFilterOptions: Array<number>
  onAssignmentSlotFilterChange: (slotFilterId: number) => void
  assignmentLayoutMode: RoomAssignmentsAssignmentLayoutMode
  onAssignmentLayoutModeChange: (nextLayoutMode: RoomAssignmentsAssignmentLayoutMode) => void
  setupLayoutMode: RoomAssignmentsSetupLayoutMode
  onSetupLayoutModeChange: (nextLayoutMode: RoomAssignmentsSetupLayoutMode) => void
  onResetRoomAssignments: () => void
  onRecalculateRoomAssignments: () => void
  onRecalculateSlotRoomAssignments: () => void
  onDownloadPlannerResult: () => void
  canDownloadPlannerResult: boolean
  isResetPending: boolean
  isRecalculatePending: boolean
}

const RoomAssignmentsPageChrome = ({
  activeTab,
  onTabChange,
  assignmentSlotFilterId,
  slotFilterOptions,
  onAssignmentSlotFilterChange,
  assignmentLayoutMode,
  onAssignmentLayoutModeChange,
  setupLayoutMode,
  onSetupLayoutModeChange,
  onResetRoomAssignments,
  onRecalculateRoomAssignments,
  onRecalculateSlotRoomAssignments,
  onDownloadPlannerResult,
  canDownloadPlannerResult,
  isResetPending,
  isRecalculatePending,
}: RoomAssignmentsPageChromeProps) => (
  <>
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
          display: 'flex',
          flex: 1,
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-start', md: 'flex-start' },
          gap: 2,
          flexDirection: { xs: 'column', md: 'row' },
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
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
            Room Assignments
          </Box>
          <Tabs
            value={activeTab}
            onChange={(_event: SyntheticEvent, nextTab: RoomAssignmentsTabId) => onTabChange(nextTab)}
          >
            <Tab label='Setup' value='setup' />
            <Tab label='Assignment' value='assignment' />
          </Tabs>
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
            maxWidth: { xs: '100%', md: 560 },
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
              {workflowLegendItems.map((item) => (
                <Box component='li' key={item}>
                  {item}
                </Box>
              ))}
            </Box>
          }
        />
      </Box>
    </Box>

    <Box
      sx={{
        px: 2,
        pb: 1,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 2,
        flexWrap: 'wrap',
      }}
    >
      {activeTab === 'assignment' ? (
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, flexWrap: 'wrap' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
            <Button variant='outlined' color='error' onClick={onResetRoomAssignments} disabled={isResetPending}>
              Reset Room Assignments
            </Button>
            <Button variant='outlined' onClick={onRecalculateRoomAssignments} disabled={isRecalculatePending}>
              Calculate
            </Button>
            <Button variant='outlined' onClick={onRecalculateSlotRoomAssignments} disabled={isRecalculatePending}>
              Calculate for This Slot
            </Button>
            <Button variant='outlined' onClick={onDownloadPlannerResult} disabled={!canDownloadPlannerResult}>
              Download Details
            </Button>
          </Box>
        </Box>
      ) : (
        <Box />
      )}
      {activeTab === 'assignment' ? (
        <>
          <ExplicitSlotFilterSelect
            slotFilterOptions={slotFilterOptions}
            slotFilterId={assignmentSlotFilterId}
            onSlotFilterChange={onAssignmentSlotFilterChange}
          />
          <ToggleButtonGroup
            value={assignmentLayoutMode}
            exclusive
            onChange={(_event: MouseEvent<HTMLElement>, nextLayoutMode: RoomAssignmentsAssignmentLayoutMode | null) => {
              if (!nextLayoutMode) {
                return
              }

              onAssignmentLayoutModeChange(nextLayoutMode)
            }}
            size='small'
            aria-label='Assignment layout'
          >
            <ToggleButton value='grid' aria-label='Grid layout'>
              Grid
            </ToggleButton>
            <ToggleButton value='columns' aria-label='Column layout'>
              Columns
            </ToggleButton>
          </ToggleButtonGroup>
        </>
      ) : (
        <ToggleButtonGroup
          value={setupLayoutMode}
          exclusive
          onChange={(_event: MouseEvent<HTMLElement>, nextLayoutMode: RoomAssignmentsSetupLayoutMode | null) => {
            if (!nextLayoutMode) {
              return
            }

            onSetupLayoutModeChange(nextLayoutMode)
          }}
          size='small'
          aria-label='Setup layout'
        >
          <ToggleButton value='rows' aria-label='Rows layout'>
            Rows
          </ToggleButton>
          <ToggleButton value='columns' aria-label='Columns layout'>
            Columns
          </ToggleButton>
        </ToggleButtonGroup>
      )}
    </Box>
  </>
)

export default RoomAssignmentsPageChrome
