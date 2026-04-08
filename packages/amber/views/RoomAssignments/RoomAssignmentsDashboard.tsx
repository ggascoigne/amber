import { Fragment } from 'react'

import { Box } from '@mui/material'
import { Group, Panel, Separator } from 'react-resizable-panels'

import type { RoomAssignmentsDashboardViewModel } from './dashboardViewModel'
import type { RoomAssignmentsLayoutPlan } from './layoutPlan'
import type { RoomAssignmentsPaneId } from './pageState'
import AssignMembersToRoomsPane from './panes/AssignMembersToRoomsPane'
import CurrentSlotRoomAvailabilityPane from './panes/CurrentSlotRoomAvailabilityPane'
import ManualGameRoomAssignmentPane from './panes/ManualGameRoomAssignmentPane'
import MemberRoomAssignmentsPane from './panes/MemberRoomAssignmentsPane'
import RoomAssignmentConflictSummaryPane from './panes/RoomAssignmentConflictSummaryPane'
import RoomSlotAvailabilityPane from './panes/RoomSlotAvailabilityPane'
import RoomUsageSummaryPane from './panes/RoomUsageSummaryPane'

type ResizeHandleProps = {
  direction: 'horizontal' | 'vertical'
}

const ResizeHandle = ({ direction }: ResizeHandleProps) => (
  <Separator
    style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: direction === 'vertical' ? 'col-resize' : 'row-resize',
      width: direction === 'vertical' ? '10px' : '100%',
      height: direction === 'horizontal' ? '10px' : '100%',
    }}
    aria-label={direction === 'vertical' ? 'Resize panels horizontally' : 'Resize panels vertically'}
  >
    <Box
      sx={{
        width: direction === 'vertical' ? 2 : '100%',
        height: direction === 'horizontal' ? 2 : '100%',
        borderRadius: 999,
        backgroundColor: 'divider',
      }}
    />
  </Separator>
)

type RoomAssignmentsDashboardProps = {
  layoutPlan: RoomAssignmentsLayoutPlan
  activeExpandedPaneId: RoomAssignmentsPaneId | null
  assignmentSlotFilterId: number
  isLoading: boolean
  isFetching: boolean
  isMutationPending: boolean
  showMemberRooms: boolean
  conflictShowAllSlots: boolean
  viewModel: RoomAssignmentsDashboardViewModel
  onToggleExpand: (paneId: RoomAssignmentsPaneId) => void
  onGameRoomChange: (args: { gameId: number; slotId: number; roomId: number | null }) => Promise<void>
  onOverrideGameRoomAdd: (args: { gameId: number; slotId: number; roomId: number | null }) => Promise<void>
  onRemoveRoomAssignment: (id: bigint) => Promise<void>
  onRoomSlotAvailabilityChange: (args: { roomId: number; slotId: number; isAvailable: boolean }) => Promise<void>
  onSetAllRoomsFullAvailability: (roomIds: Array<number>) => Promise<void>
  onMemberRoomChange: (args: { memberId: number; roomId: number | null }) => Promise<void>
  onRoomMembersChange: (args: { roomId: number; memberIds: Array<number> }) => Promise<void>
  onRoomEnabledChange: (args: { roomId: number; enabled: boolean }) => Promise<void>
  onShowMemberRoomsChange: (showMemberRooms: boolean) => void
  onConflictShowAllSlotsChange: (showAllSlots: boolean) => void
}

const RoomAssignmentsDashboard = ({
  layoutPlan,
  activeExpandedPaneId,
  assignmentSlotFilterId,
  isLoading,
  isFetching,
  isMutationPending,
  showMemberRooms,
  conflictShowAllSlots,
  viewModel,
  onToggleExpand,
  onGameRoomChange,
  onOverrideGameRoomAdd,
  onRemoveRoomAssignment,
  onRoomSlotAvailabilityChange,
  onSetAllRoomsFullAvailability,
  onMemberRoomChange,
  onRoomMembersChange,
  onRoomEnabledChange,
  onShowMemberRoomsChange,
  onConflictShowAllSlotsChange,
}: RoomAssignmentsDashboardProps) => {
  const renderPane = (paneId: RoomAssignmentsPaneId) => {
    const isPaneExpanded = activeExpandedPaneId === paneId

    switch (paneId) {
      case 'slotAvailability':
        return (
          <RoomSlotAvailabilityPane
            isExpanded={isPaneExpanded}
            onToggleExpand={() => onToggleExpand(paneId)}
            rows={viewModel.roomSlotAvailabilityRows}
            slotIds={viewModel.slotIds}
            isLoading={isLoading}
            isFetching={isFetching}
            onRoomSlotAvailabilityChange={onRoomSlotAvailabilityChange}
            onSetAllRoomsFullAvailability={onSetAllRoomsFullAvailability}
          />
        )
      case 'memberRoomAssignments':
        return (
          <MemberRoomAssignmentsPane
            isExpanded={isPaneExpanded}
            onToggleExpand={() => onToggleExpand(paneId)}
            rows={viewModel.memberRoomRows}
            isLoading={isLoading}
            isFetching={isFetching}
            isMutationPending={isMutationPending}
            roomOptions={viewModel.roomOptions}
            onMemberRoomChange={onMemberRoomChange}
          />
        )
      case 'roomMemberAssignments':
        return (
          <AssignMembersToRoomsPane
            isExpanded={isPaneExpanded}
            onToggleExpand={() => onToggleExpand(paneId)}
            rows={viewModel.roomMemberRows}
            isLoading={isLoading}
            isFetching={isFetching}
            isMutationPending={isMutationPending}
            memberOptions={viewModel.memberOptions}
            onRoomEnabledChange={onRoomEnabledChange}
            onRoomMembersChange={onRoomMembersChange}
          />
        )
      case 'manualGameRoomAssignment':
        return (
          <ManualGameRoomAssignmentPane
            isExpanded={isPaneExpanded}
            onToggleExpand={() => onToggleExpand(paneId)}
            slotId={assignmentSlotFilterId}
            rows={viewModel.filteredManualGameRows}
            isLoading={isLoading}
            isFetching={isFetching}
            isMutationPending={isMutationPending}
            roomOptions={viewModel.enabledManualRoomOptions}
            onGameRoomChange={onGameRoomChange}
            onAddOverrideRoom={onOverrideGameRoomAdd}
            onRemoveRoomAssignment={onRemoveRoomAssignment}
          />
        )
      case 'roomAvailability':
        return (
          <CurrentSlotRoomAvailabilityPane
            isExpanded={isPaneExpanded}
            onToggleExpand={() => onToggleExpand(paneId)}
            slotId={assignmentSlotFilterId}
            rows={viewModel.currentSlotAvailableRooms}
            isLoading={isLoading}
            isFetching={isFetching}
          />
        )
      case 'conflictSummary':
        return (
          <RoomAssignmentConflictSummaryPane
            isExpanded={isPaneExpanded}
            onToggleExpand={() => onToggleExpand(paneId)}
            slotId={assignmentSlotFilterId}
            rows={viewModel.filteredRoomAssignmentConflictRows}
            isLoading={isLoading}
            isFetching={isFetching}
            showAllSlots={conflictShowAllSlots}
            onShowAllSlotsChange={onConflictShowAllSlotsChange}
          />
        )
      case 'roomUsageSummary':
        return (
          <RoomUsageSummaryPane
            isExpanded={isPaneExpanded}
            onToggleExpand={() => onToggleExpand(paneId)}
            rows={viewModel.filteredRoomUsageSummaryRows}
            isLoading={isLoading}
            isFetching={isFetching}
            showMemberRooms={showMemberRooms}
            onShowMemberRoomsChange={onShowMemberRoomsChange}
          />
        )
      default:
        return null
    }
  }

  const renderLayoutPlan = (plan: RoomAssignmentsLayoutPlan) => {
    switch (plan.type) {
      case 'pane':
        return <Box sx={{ flex: 1, minHeight: 0 }}>{renderPane(plan.paneId)}</Box>
      case 'stack':
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, flex: 1, minHeight: 0 }}>
            {plan.paneIds.map((paneId) => (
              <Box key={paneId} sx={{ minHeight: 0, flex: 1 }}>
                {renderPane(paneId)}
              </Box>
            ))}
          </Box>
        )
      case 'group':
        return (
          <Group orientation={plan.orientation} style={{ flex: 1, minHeight: 0 }}>
            {plan.panels.map((panel, panelIndex) => (
              <Fragment key={panelIndex}>
                {panelIndex > 0 ? (
                  <ResizeHandle direction={plan.orientation === 'horizontal' ? 'vertical' : 'horizontal'} />
                ) : null}
                <Panel
                  defaultSize={panel.defaultSize}
                  minSize={panel.minSize}
                  style={{ display: 'flex', flexDirection: 'column', minHeight: 0 }}
                >
                  {renderLayoutPlan(panel.plan)}
                </Panel>
              </Fragment>
            ))}
          </Group>
        )
      default:
        return null
    }
  }

  return renderLayoutPlan(layoutPlan)
}

export default RoomAssignmentsDashboard
