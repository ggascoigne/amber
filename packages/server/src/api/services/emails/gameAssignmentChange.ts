import { getEmailer, sendTemplateEmail } from './mailer'
import type { EmailSendResult, RuntimeSettings } from './types'

import type { Context } from '../../context'
import type { GameAssignmentChangeBody } from '../../contracts/email'

type ChangeDetail = {
  action: 'added' | 'moved' | 'removed'
  memberId: number
  newGameId?: number
  oldGameId?: number
}

type PersonInfo = {
  email: string
  name: string
}

type GameInfo = {
  id: number
  name: string
  slotId: number | null
}

const appendToMap = (map: Map<number, Array<number>>, memberId: number, gameId: number) => {
  const existing = map.get(memberId)
  if (existing) {
    existing.push(gameId)
    return
  }

  map.set(memberId, [gameId])
}

const correlateChanges = (
  adds: Array<{ memberId: number; gameId: number }>,
  removes: Array<{ memberId: number; gameId: number }>,
) => {
  const addsByMember = new Map<number, Array<number>>()
  const removesByMember = new Map<number, Array<number>>()

  adds.forEach(({ memberId, gameId }) => appendToMap(addsByMember, memberId, gameId))
  removes.forEach(({ memberId, gameId }) => appendToMap(removesByMember, memberId, gameId))

  const details: Array<ChangeDetail> = []
  const memberIds = new Set([...addsByMember.keys(), ...removesByMember.keys()])

  memberIds.forEach((memberId) => {
    const addedGameIds = addsByMember.get(memberId) ?? []
    const removedGameIds = removesByMember.get(memberId) ?? []
    const pairedCount = Math.min(addedGameIds.length, removedGameIds.length)

    for (let index = 0; index < pairedCount; index += 1) {
      details.push({
        action: 'moved',
        memberId,
        newGameId: addedGameIds[index],
        oldGameId: removedGameIds[index],
      })
    }

    for (let index = pairedCount; index < addedGameIds.length; index += 1) {
      details.push({
        action: 'added',
        memberId,
        newGameId: addedGameIds[index],
      })
    }

    for (let index = pairedCount; index < removedGameIds.length; index += 1) {
      details.push({
        action: 'removed',
        memberId,
        oldGameId: removedGameIds[index],
      })
    }
  })

  return details
}

const lookupMemberInfo = async (ctx: Context, memberId: number): Promise<PersonInfo | null> => {
  const membership = await ctx.db.membership.findUnique({
    select: {
      user: {
        select: {
          email: true,
          fullName: true,
        },
      },
    },
    where: { id: memberId },
  })

  if (!membership) {
    return null
  }

  return {
    email: membership.user.email,
    name: membership.user.fullName ?? membership.user.email,
  }
}

const lookupGameInfo = async (ctx: Context, gameId: number): Promise<GameInfo | null> => {
  const game = await ctx.db.game.findUnique({
    select: {
      id: true,
      name: true,
      slotId: true,
    },
    where: { id: gameId },
  })

  return game
}

const lookupGameGms = async (ctx: Context, gameId: number, year: number): Promise<Array<PersonInfo>> => {
  const assignments = await ctx.db.gameAssignment.findMany({
    select: {
      membership: {
        select: {
          user: {
            select: {
              email: true,
              fullName: true,
            },
          },
        },
      },
    },
    where: {
      gameId,
      gm: { gt: 0 },
      year,
    },
  })

  return assignments.map((assignment) => ({
    email: assignment.membership.user.email,
    name: assignment.membership.user.fullName ?? assignment.membership.user.email,
  }))
}

export const sendGameAssignmentChange = async (
  ctx: Context,
  body: GameAssignmentChangeBody,
  settings: RuntimeSettings,
): Promise<EmailSendResult> => {
  const emailer = await getEmailer()
  const displaySchedule = settings.flags.display_schedule ?? 'No'
  if (displaySchedule === 'No' || displaySchedule === 'Admin' || displaySchedule === 'GameAdmin') {
    return { sentCount: 0 }
  }

  const changes = correlateChanges(body.adds, body.removes)
  if (changes.length === 0) {
    return { sentCount: 0 }
  }

  const uniqueMemberIds = [...new Set(changes.map((change) => change.memberId))]
  const uniqueGameIds = [
    ...new Set(
      changes.flatMap((change) => [change.oldGameId, change.newGameId].filter((value): value is number => !!value)),
    ),
  ]

  const [members, games, gms] = await Promise.all([
    Promise.all(uniqueMemberIds.map(async (memberId) => [memberId, await lookupMemberInfo(ctx, memberId)] as const)),
    Promise.all(uniqueGameIds.map(async (gameId) => [gameId, await lookupGameInfo(ctx, gameId)] as const)),
    Promise.all(uniqueGameIds.map(async (gameId) => [gameId, await lookupGameGms(ctx, gameId, body.year)] as const)),
  ])

  const memberMap = new Map(members)
  const gameMap = new Map(games)
  const gmMap = new Map(gms)
  const promises: Array<Promise<unknown>> = []

  changes.forEach((change) => {
    const player = memberMap.get(change.memberId)
    if (!player) {
      return
    }

    const oldGame = change.oldGameId ? (gameMap.get(change.oldGameId) ?? null) : null
    const newGame = change.newGameId ? (gameMap.get(change.newGameId) ?? null) : null
    const slotId = newGame?.slotId ?? oldGame?.slotId ?? 0
    const locals = {
      action: change.action,
      newGameName: newGame?.name ?? '',
      oldGameName: oldGame?.name ?? '',
      playerName: player.name,
      slotId,
      year: body.year,
    }

    if (displaySchedule === 'Member' || displaySchedule === 'Yes') {
      promises.push(
        sendTemplateEmail(emailer, {
          locals: {
            ...locals,
            recipientRole: 'player',
          },
          message: {
            to: player.email,
          },
          template: 'gameAssignmentChange',
        }),
      )
    }

    if (change.oldGameId) {
      const oldGms = gmMap.get(change.oldGameId) ?? []
      oldGms.forEach((gm) => {
        promises.push(
          sendTemplateEmail(emailer, {
            locals: {
              ...locals,
              direction: 'from',
              gmName: gm.name,
              recipientRole: 'gm',
            },
            message: {
              to: gm.email,
            },
            template: 'gameAssignmentChange',
          }),
        )
      })
    }

    if (change.newGameId) {
      const newGms = gmMap.get(change.newGameId) ?? []
      newGms.forEach((gm) => {
        promises.push(
          sendTemplateEmail(emailer, {
            locals: {
              ...locals,
              direction: 'to',
              gmName: gm.name,
              recipientRole: 'gm',
            },
            message: {
              to: gm.email,
            },
            template: 'gameAssignmentChange',
          }),
        )
      })
    }
  })

  const results = await Promise.allSettled(promises)
  return {
    sentCount: results.filter((result) => result.status === 'fulfilled').length,
  }
}
