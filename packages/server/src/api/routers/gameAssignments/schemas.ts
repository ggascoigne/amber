import { z } from 'zod'

export const gameAssignmentDataInput = z.object({
  gameId: z.number(),
  gm: z.number(),
  memberId: z.number(),
  year: z.number(),
})

export const getGameAssignmentsByYearInput = z.object({
  year: z.number(),
})

export const getAssignmentDashboardDataInput = getGameAssignmentsByYearInput
export const getAssignmentSummaryInput = getGameAssignmentsByYearInput
export const resetGameAssignmentsInput = getGameAssignmentsByYearInput
export const setInitialGameAssignmentsInput = getGameAssignmentsByYearInput

export const getGameAssignmentsByGameIdInput = z.object({
  gameId: z.number(),
})

export const getGameAssignmentsByMemberIdInput = z.object({
  memberId: z.number(),
})

export const getGameAssignmentScheduleInput = getGameAssignmentsByMemberIdInput

export const isGameMasterInput = z.object({
  userId: z.number(),
  year: z.number(),
})

export const createGameAssignmentInput = gameAssignmentDataInput
export const deleteGameAssignmentInput = gameAssignmentDataInput

export const updateGameAssignmentsInput = z.object({
  year: z.number(),
  adds: z.array(gameAssignmentDataInput),
  removes: z.array(gameAssignmentDataInput),
})

export type GameAssignmentDataInput = z.infer<typeof gameAssignmentDataInput>
export type GetGameAssignmentsByYearInput = z.infer<typeof getGameAssignmentsByYearInput>
export type GetAssignmentDashboardDataInput = z.infer<typeof getAssignmentDashboardDataInput>
export type GetAssignmentSummaryInput = z.infer<typeof getAssignmentSummaryInput>
export type ResetGameAssignmentsInput = z.infer<typeof resetGameAssignmentsInput>
export type SetInitialGameAssignmentsInput = z.infer<typeof setInitialGameAssignmentsInput>
export type GetGameAssignmentsByGameIdInput = z.infer<typeof getGameAssignmentsByGameIdInput>
export type GetGameAssignmentsByMemberIdInput = z.infer<typeof getGameAssignmentsByMemberIdInput>
export type GetGameAssignmentScheduleInput = z.infer<typeof getGameAssignmentScheduleInput>
export type IsGameMasterInput = z.infer<typeof isGameMasterInput>
export type CreateGameAssignmentInput = z.infer<typeof createGameAssignmentInput>
export type DeleteGameAssignmentInput = z.infer<typeof deleteGameAssignmentInput>
export type UpdateGameAssignmentsInput = z.infer<typeof updateGameAssignmentsInput>
