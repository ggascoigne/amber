import { z } from 'zod'

export const roomAssignmentsYearInput = z.object({
  year: z.number(),
})

export const getRoomAssignmentDashboardDataInput = roomAssignmentsYearInput

export const getScheduleRoomAssignmentDataInput = z.object({
  gameId: z.number(),
  year: z.number(),
})

export const roomAssignmentSourceInput = z.enum(['manual', 'auto'])

export const assignGameRoomInput = z.object({
  gameId: z.number(),
  roomId: z.number(),
  slotId: z.number(),
  year: z.number(),
  isOverride: z.boolean().optional(),
  source: roomAssignmentSourceInput.optional(),
  assignmentReason: z.string().nullable().optional(),
})

export const removeGameRoomAssignmentInput = z.object({
  id: z.bigint(),
})

export const upsertRoomSlotAvailabilityInput = z.object({
  roomId: z.number(),
  slotId: z.number(),
  year: z.number(),
  isAvailable: z.boolean(),
})

export const upsertMemberRoomAssignmentInput = z.object({
  memberId: z.number(),
  roomId: z.number().nullable(),
  year: z.number(),
})

export const roomAssignmentResetModeInput = z.enum(['all', 'auto_only'])

export const resetRoomAssignmentsInput = z.object({
  year: z.number(),
  mode: roomAssignmentResetModeInput.default('all'),
})

export const makeInitialRoomAssignmentsInput = roomAssignmentsYearInput

export const recalculateRoomAssignmentsInput = z.object({
  year: z.number(),
  slotId: z.number().optional(),
})

export const applyRoomAssignmentPlannerDeleteWhereInput = z.object({
  year: z.number(),
  source: z.literal('auto').optional(),
  slotId: z.number().optional(),
  isOverride: z.boolean().optional(),
})

export const applyRoomAssignmentPlannerInput = z.object({
  year: z.number(),
  assignedByUserId: z.number().nullable(),
  slotId: z.number().optional(),
  deleteWhere: applyRoomAssignmentPlannerDeleteWhereInput,
})

export type GetRoomAssignmentDashboardDataInput = z.infer<typeof getRoomAssignmentDashboardDataInput>
export type GetScheduleRoomAssignmentDataInput = z.infer<typeof getScheduleRoomAssignmentDataInput>
export type RoomAssignmentSource = z.infer<typeof roomAssignmentSourceInput>
export type AssignGameRoomInput = z.infer<typeof assignGameRoomInput>
export type RemoveGameRoomAssignmentInput = z.infer<typeof removeGameRoomAssignmentInput>
export type UpsertRoomSlotAvailabilityInput = z.infer<typeof upsertRoomSlotAvailabilityInput>
export type UpsertMemberRoomAssignmentInput = z.infer<typeof upsertMemberRoomAssignmentInput>
export type RoomAssignmentResetMode = z.infer<typeof roomAssignmentResetModeInput>
export type ResetRoomAssignmentsInput = z.infer<typeof resetRoomAssignmentsInput>
export type MakeInitialRoomAssignmentsInput = z.infer<typeof makeInitialRoomAssignmentsInput>
export type RecalculateRoomAssignmentsInput = z.infer<typeof recalculateRoomAssignmentsInput>
export type ApplyRoomAssignmentPlannerDeleteWhere = z.infer<typeof applyRoomAssignmentPlannerDeleteWhereInput>
export type ApplyRoomAssignmentPlannerInput = z.infer<typeof applyRoomAssignmentPlannerInput>
