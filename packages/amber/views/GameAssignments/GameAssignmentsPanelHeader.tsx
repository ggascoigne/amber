import CloseFullscreenIcon from '@mui/icons-material/CloseFullscreen'
import OpenInFullIcon from '@mui/icons-material/OpenInFull'
import { Box, IconButton, Typography } from '@mui/material'

import { ShowExpandedToggle } from './ShowExpandedToggle'
import { SlotFilterSelect } from './SlotFilterSelect'

type GameAssignmentsPanelHeaderProps = {
  title: string
  titleId: string
  slotFilterOptions: Array<number>
  slotFilterId: number | null
  onSlotFilterChange: (slotFilterId: number | null) => void
  showExpandedOnly: boolean
  onShowExpandedOnlyChange: (showExpandedOnly: boolean) => void
  isExpanded?: boolean
  onToggleExpand?: () => void
}

export const GameAssignmentsPanelHeader = ({
  title,
  titleId,
  slotFilterOptions,
  slotFilterId,
  onSlotFilterChange,
  showExpandedOnly,
  onShowExpandedOnlyChange,
  isExpanded = false,
  onToggleExpand,
}: GameAssignmentsPanelHeaderProps) => (
  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
    <Typography id={titleId} variant='h6' component='h2'>
      {title}
    </Typography>
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <SlotFilterSelect
        slotFilterOptions={slotFilterOptions}
        slotFilterId={slotFilterId}
        onSlotFilterChange={onSlotFilterChange}
      />
      <ShowExpandedToggle checked={showExpandedOnly} onChange={onShowExpandedOnlyChange} />
      {onToggleExpand ? (
        <IconButton aria-label={isExpanded ? 'Exit full view' : 'Expand panel'} onClick={onToggleExpand} size='small'>
          {isExpanded ? <CloseFullscreenIcon fontSize='small' /> : <OpenInFullIcon fontSize='small' />}
        </IconButton>
      ) : null}
    </Box>
  </Box>
)
