import type { RecalculateRoomAssignmentsResult } from '@amber/client'
import * as XLSX from 'xlsx/dist/xlsx.mini.min'

const buildExportFilename = ({ year, scope, slotId }: { year: number; scope: string; slotId: number | null }) => {
  const timestamp = new Date().toISOString().replaceAll(':', '-')
  return scope === 'slot' && slotId
    ? `room-assignment-summary-${year}-slot-${slotId}-${timestamp}.xlsx`
    : `room-assignment-summary-${year}-${timestamp}.xlsx`
}

export const downloadInitialPlannerResult = ({
  result,
  year,
}: {
  result: RecalculateRoomAssignmentsResult
  year: number
}) => {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return
  }

  const workbook = XLSX.utils.book_new()

  const summarySheet = XLSX.utils.json_to_sheet([
    { metric: 'Scope', value: result.scope === 'slot' && result.slotId ? `Slot ${result.slotId}` : 'Whole schedule' },
    { metric: 'Deleted assignments', value: result.deletedAssignments },
    { metric: 'Created auto assignments', value: result.createdAssignments },
    { metric: 'Skipped games', value: result.skippedGames.length },
    { metric: 'Unmet targets', value: result.unmetConstraints.length },
  ])
  XLSX.utils.book_append_sheet(workbook, summarySheet, 'Summary')

  const assignmentsSheet = XLSX.utils.json_to_sheet(
    result.assignments.map((assignment) => ({
      slot: assignment.slotId,
      game: assignment.gameName,
      room: assignment.roomDescription,
      reason: assignment.reason,
    })),
  )
  XLSX.utils.book_append_sheet(workbook, assignmentsSheet, 'Assignments')

  const skippedGamesSheet = XLSX.utils.json_to_sheet(
    result.skippedGames.map((game) => ({
      slot: game.slotId,
      game: game.gameName,
      participants: game.participantCount,
      reason: game.reason,
    })),
  )
  XLSX.utils.book_append_sheet(workbook, skippedGamesSheet, 'Skipped Games')

  const unmetTargetsSheet = XLSX.utils.json_to_sheet(
    result.unmetConstraints.map((constraint) => ({
      slot: constraint.slotId,
      type: constraint.type,
      detail: constraint.detail,
    })),
  )
  XLSX.utils.book_append_sheet(workbook, unmetTargetsSheet, 'Unmet Targets')

  XLSX.writeFile(
    workbook,
    buildExportFilename({
      year,
      scope: result.scope,
      slotId: result.slotId,
    }),
    {
      bookType: 'xlsx',
    },
  )
}
