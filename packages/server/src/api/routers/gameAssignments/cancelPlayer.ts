import { TRPCError } from '@trpc/server'

import type { CancelPlayerInput } from './schemas'

import type { TransactionClient } from '../../inRlsTransaction'

export const cancelPlayer = async ({ tx, input }: { tx: TransactionClient; input: CancelPlayerInput }) => {
  const membership = await tx.membership.findFirst({
    where: { id: input.memberId, year: input.year, attending: true },
    select: { id: true },
  })

  if (!membership) {
    throw new TRPCError({ code: 'NOT_FOUND', message: 'Attending membership not found for this year' })
  }

  const [slots, noGameGames] = await Promise.all([
    tx.slot.findMany({ select: { id: true } }),
    tx.game.findMany({
      where: { year: input.year, category: 'no_game' },
      select: { id: true, slotId: true },
    }),
  ])
  const noGameIdBySlotId = new Map(
    noGameGames.filter((game) => game.slotId !== null).map((game) => [game.slotId as number, game.id]),
  )
  const missingSlot = slots.find((slot) => !noGameIdBySlotId.has(slot.id))

  if (missingSlot) {
    throw new TRPCError({ code: 'BAD_REQUEST', message: `No Game is missing for slot ${missingSlot.id}` })
  }

  const cancelledPlayerAssignments = await tx.gameAssignment.findMany({
    where: { memberId: membership.id, year: input.year, gm: 0 },
    select: {
      gameId: true,
      game: {
        select: {
          category: true,
          slotId: true,
        },
      },
    },
  })
  const affectedGameIds = cancelledPlayerAssignments
    .filter((assignment) => assignment.game.category === 'user' && assignment.game.slotId !== null)
    .map((assignment) => assignment.gameId)
  const affectedGameMasters = affectedGameIds.length
    ? await tx.gameAssignment.findMany({
        where: { year: input.year, gm: { gt: 0 }, gameId: { in: affectedGameIds } },
        select: {
          game: {
            select: { id: true, name: true, slotId: true },
          },
          membership: {
            select: {
              user: {
                select: { email: true, fullName: true },
              },
            },
          },
        },
      })
    : []

  await tx.gameAssignment.deleteMany({ where: { memberId: membership.id, year: input.year } })
  const created = await tx.gameAssignment.createMany({
    data: slots.map((slot) => ({
      memberId: membership.id,
      gameId: noGameIdBySlotId.get(slot.id) as number,
      gm: 0,
      year: input.year,
    })),
  })
  await tx.membership.update({ where: { id: membership.id }, data: { attending: false } })

  return {
    assignedNoGameSlots: created.count,
    affectedGameMasters: affectedGameMasters
      .map((assignment) => ({
        email: assignment.membership.user.email,
        gameName: assignment.game.name,
        gmName: assignment.membership.user.fullName ?? 'Unknown GM',
        slotId: assignment.game.slotId as number,
      }))
      .sort((left, right) =>
        left.slotId === right.slotId
          ? left.gameName.localeCompare(right.gameName) || left.gmName.localeCompare(right.gmName)
          : left.slotId - right.slotId,
      ),
  }
}
