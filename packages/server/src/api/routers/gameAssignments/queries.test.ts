import { describe, expect, test, vi } from 'vitest'

import {
  getGameAssignmentsByGameId,
  getGameAssignmentsByMemberId,
  getGameAssignmentsByYear,
  isGameMaster,
} from './queries'

import type { TransactionClient } from '../../inRlsTransaction'

const createGameAssignmentsQueriesTx = () => {
  const assignmentsByYear = [{ memberId: 10, gameId: 4, gm: 0, year: 2026 }]
  const assignmentsByGame = [{ memberId: 11, gameId: 7, gm: 1, year: 2026 }]
  const assignmentsByMember = [{ memberId: 12, gameId: 9, gm: 0, year: 2026 }]
  const gameMasterAssignments = [{ memberId: 12, gameId: 9, gm: -1, year: 2026 }]
  const nonGameMasterAssignments: Array<{ memberId: number; gameId: number; gm: number; year: number }> = []

  const gameAssignmentFindMany = vi
    .fn()
    .mockResolvedValueOnce(assignmentsByYear)
    .mockResolvedValueOnce(assignmentsByGame)
    .mockResolvedValueOnce(assignmentsByMember)
    .mockResolvedValueOnce(gameMasterAssignments)
    .mockResolvedValueOnce(nonGameMasterAssignments)

  const tx = {
    gameAssignment: {
      findMany: gameAssignmentFindMany,
    },
  } as unknown as TransactionClient

  return {
    assignmentsByGame,
    assignmentsByMember,
    assignmentsByYear,
    gameAssignmentFindMany,
    gameMasterAssignments,
    nonGameMasterAssignments,
    tx,
  }
}

describe('game assignment query helpers', () => {
  test('loads year, game, and member assignment lists with the preserved where clauses', async () => {
    const fixture = createGameAssignmentsQueriesTx()

    const byYear = await getGameAssignmentsByYear({
      tx: fixture.tx,
      input: { year: 2026 },
    })
    const byGame = await getGameAssignmentsByGameId({
      tx: fixture.tx,
      input: { gameId: 7 },
    })
    const byMember = await getGameAssignmentsByMemberId({
      tx: fixture.tx,
      input: { memberId: 12 },
    })

    expect(fixture.gameAssignmentFindMany).toHaveBeenNthCalledWith(1, {
      where: { year: 2026 },
    })
    expect(fixture.gameAssignmentFindMany).toHaveBeenNthCalledWith(2, {
      where: { gameId: 7 },
    })
    expect(fixture.gameAssignmentFindMany).toHaveBeenNthCalledWith(3, {
      where: { memberId: 12 },
    })
    expect(byYear).toEqual(fixture.assignmentsByYear)
    expect(byGame).toEqual(fixture.assignmentsByGame)
    expect(byMember).toEqual(fixture.assignmentsByMember)
  })

  test('treats any non-zero GM assignment for the matching user and year as game-master access', async () => {
    const fixture = createGameAssignmentsQueriesTx()

    await getGameAssignmentsByYear({
      tx: fixture.tx,
      input: { year: 2026 },
    })
    await getGameAssignmentsByGameId({
      tx: fixture.tx,
      input: { gameId: 7 },
    })
    await getGameAssignmentsByMemberId({
      tx: fixture.tx,
      input: { memberId: 12 },
    })

    const isGameMasterResult = await isGameMaster({
      tx: fixture.tx,
      input: { userId: 44, year: 2026 },
    })
    const isNotGameMasterResult = await isGameMaster({
      tx: fixture.tx,
      input: { userId: 45, year: 2027 },
    })

    expect(fixture.gameAssignmentFindMany).toHaveBeenNthCalledWith(4, {
      where: {
        gm: { not: 0 },
        membership: {
          userId: 44,
          year: 2026,
        },
      },
    })
    expect(fixture.gameAssignmentFindMany).toHaveBeenNthCalledWith(5, {
      where: {
        gm: { not: 0 },
        membership: {
          userId: 45,
          year: 2027,
        },
      },
    })
    expect(isGameMasterResult).toBe(true)
    expect(isNotGameMasterResult).toBe(false)
  })
})
