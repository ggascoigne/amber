import { describe, expect, test } from 'vitest'

import {
  applyRoomAssignmentPlannerInput,
  assignGameRoomInput,
  resetRoomAssignmentsInput,
  roomAssignmentsYearInput,
} from './schemas'

describe('room assignment schemas', () => {
  test('preserves the shared year-only payload used by dashboard and initial-assignment flows', () => {
    const result = roomAssignmentsYearInput.parse({
      year: 2026,
    })

    expect(result).toEqual({
      year: 2026,
    })
  })

  test('preserves the optional override and nullable reason contract for room assignment writes', () => {
    const result = assignGameRoomInput.parse({
      gameId: 10,
      roomId: 12,
      slotId: 4,
      year: 2026,
      isOverride: true,
      source: 'manual',
      assignmentReason: null,
    })

    expect(result).toEqual({
      gameId: 10,
      roomId: 12,
      slotId: 4,
      year: 2026,
      isOverride: true,
      source: 'manual',
      assignmentReason: null,
    })
  })

  test('preserves reset defaulting and planner delete scopes for recalculation flows', () => {
    const resetResult = resetRoomAssignmentsInput.parse({
      year: 2026,
    })
    const plannerResult = applyRoomAssignmentPlannerInput.parse({
      year: 2026,
      assignedByUserId: null,
      slotId: 3,
      deleteWhere: {
        year: 2026,
        slotId: 3,
        isOverride: false,
      },
    })

    expect(resetResult).toEqual({
      year: 2026,
      mode: 'all',
    })
    expect(plannerResult).toEqual({
      year: 2026,
      assignedByUserId: null,
      slotId: 3,
      deleteWhere: {
        year: 2026,
        slotId: 3,
        isOverride: false,
      },
    })
  })
})
