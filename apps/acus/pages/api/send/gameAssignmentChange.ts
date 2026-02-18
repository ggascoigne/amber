import type { GameAssignmentChangeBody } from '@amber/amber/utils/apiTypes'
import { emailer, getDisplayScheduleFlag, handleError, JsonError } from '@amber/api'
import { auth0 } from '@amber/server/src/auth/auth0'
import { db } from '@amber/server/src/db'
import type { NextApiRequest, NextApiResponse } from 'next'

// /api/send/gameAssignmentChange
// auth token: required
// body: {
//   year: number
//   adds: Array<{ memberId: number; gameId: number }>
//   removes: Array<{ memberId: number; gameId: number }>
// }

interface ChangeDetail {
  memberId: number
  action: 'moved' | 'added' | 'removed'
  oldGameId?: number
  newGameId?: number
}

interface GameInfo {
  id: number
  name: string
  slotId: number | null
}

interface PersonInfo {
  name: string
  email: string
}

const appendToMap = (map: Map<number, number[]>, memberId: number, gameId: number) => {
  const existing = map.get(memberId)
  if (existing) {
    existing.push(gameId)
  } else {
    map.set(memberId, [gameId])
  }
}

const correlateChanges = (
  adds: Array<{ memberId: number; gameId: number }>,
  removes: Array<{ memberId: number; gameId: number }>,
): ChangeDetail[] => {
  const addsByMember = new Map<number, number[]>()
  const removesByMember = new Map<number, number[]>()

  adds.forEach(({ memberId, gameId }) => appendToMap(addsByMember, memberId, gameId))
  removes.forEach(({ memberId, gameId }) => appendToMap(removesByMember, memberId, gameId))

  const details: ChangeDetail[] = []
  const allMemberIds = new Set([...addsByMember.keys(), ...removesByMember.keys()])

  allMemberIds.forEach((memberId) => {
    const addedGameIds = addsByMember.get(memberId) ?? []
    const removedGameIds = removesByMember.get(memberId) ?? []

    // Pair up adds and removes as moves (by position)
    const pairedCount = Math.min(addedGameIds.length, removedGameIds.length)
    for (let i = 0; i < pairedCount; i++) {
      details.push({ memberId, action: 'moved', oldGameId: removedGameIds[i], newGameId: addedGameIds[i] })
    }

    // Remaining adds (standalone)
    for (let i = pairedCount; i < addedGameIds.length; i++) {
      details.push({ memberId, action: 'added', newGameId: addedGameIds[i] })
    }

    // Remaining removes (standalone)
    for (let i = pairedCount; i < removedGameIds.length; i++) {
      details.push({ memberId, action: 'removed', oldGameId: removedGameIds[i] })
    }
  })

  return details
}

const lookupMemberInfo = async (memberId: number): Promise<PersonInfo | null> => {
  const membership = await db.membership.findUnique({
    where: { id: memberId },
    select: { user: { select: { fullName: true, email: true } } },
  })
  if (!membership) return null
  return { name: membership.user.fullName ?? membership.user.email, email: membership.user.email }
}

const lookupGameInfo = async (gameId: number): Promise<GameInfo | null> => {
  const game = await db.game.findUnique({
    where: { id: gameId },
    select: { id: true, name: true, slotId: true },
  })
  return game
}

const lookupGameGMs = async (gameId: number, year: number): Promise<PersonInfo[]> => {
  const gmAssignments = await db.gameAssignment.findMany({
    where: { gameId, year, gm: { gt: 0 } },
    select: {
      membership: {
        select: { user: { select: { fullName: true, email: true } } },
      },
    },
  })
  return gmAssignments.map((a) => ({
    name: a.membership.user.fullName ?? a.membership.user.email,
    email: a.membership.user.email,
  }))
}

export default auth0.withApiAuthRequired(async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    if (!req.body) throw new JsonError(400, 'missing body: expecting year, adds, removes')
    const { year, adds, removes } = req.body as GameAssignmentChangeBody
    if (!year) throw new JsonError(400, 'missing year')
    if (!adds && !removes) throw new JsonError(400, 'missing adds or removes')

    const displaySchedule = await getDisplayScheduleFlag()
    if (displaySchedule === 'No' || displaySchedule === 'Admin' || displaySchedule === 'GameAdmin') {
      res.status(200).send({ result: 'schedule not published, no emails sent' })
      return
    }

    const changes = correlateChanges(adds ?? [], removes ?? [])
    if (changes.length === 0) {
      res.status(200).send({ result: 'no changes detected' })
      return
    }

    // Batch all DB lookups upfront
    const uniqueMemberIds = [...new Set(changes.map((c) => c.memberId))]
    const uniqueGameIds = [
      ...new Set(changes.flatMap((c) => [c.oldGameId, c.newGameId].filter((id): id is number => id !== undefined))),
    ]

    const [memberInfos, gameInfos, gmInfos] = await Promise.all([
      Promise.all(uniqueMemberIds.map(async (id) => [id, await lookupMemberInfo(id)] as const)),
      Promise.all(uniqueGameIds.map(async (id) => [id, await lookupGameInfo(id)] as const)),
      Promise.all(uniqueGameIds.map(async (id) => [id, await lookupGameGMs(id, year)] as const)),
    ])

    const memberMap = new Map(memberInfos)
    const gameMap = new Map(gameInfos)
    const gmMap = new Map(gmInfos)

    const emailPromises: Promise<any>[] = []

    changes.forEach((change) => {
      const player = memberMap.get(change.memberId)
      if (!player) return

      const oldGame = change.oldGameId ? (gameMap.get(change.oldGameId) ?? null) : null
      const newGame = change.newGameId ? (gameMap.get(change.newGameId) ?? null) : null

      const slotId = newGame?.slotId ?? oldGame?.slotId ?? 0

      const baseLocals = {
        year,
        slotId,
        playerName: player.name,
        oldGameName: oldGame?.name ?? '',
        newGameName: newGame?.name ?? '',
        action: change.action,
      }

      // Email the player
      emailPromises.push(
        emailer.send({
          template: 'gameAssignmentChange',
          message: { to: player.email },
          locals: { ...baseLocals, recipientRole: 'player' },
        }),
      )

      // Email GM(s) of the old game (removed/moved from)
      if (change.oldGameId) {
        const oldGMs = gmMap.get(change.oldGameId) ?? []
        oldGMs.forEach((gm) => {
          emailPromises.push(
            emailer.send({
              template: 'gameAssignmentChange',
              message: { to: gm.email },
              locals: { ...baseLocals, recipientRole: 'gm', gmName: gm.name, direction: 'from' },
            }),
          )
        })
      }

      // Email GM(s) of the new game (added/moved to)
      if (change.newGameId) {
        const newGMs = gmMap.get(change.newGameId) ?? []
        newGMs.forEach((gm) => {
          emailPromises.push(
            emailer.send({
              template: 'gameAssignmentChange',
              message: { to: gm.email },
              locals: { ...baseLocals, recipientRole: 'gm', gmName: gm.name, direction: 'to' },
            }),
          )
        })
      }
    })

    const results = await Promise.allSettled(emailPromises)
    const failures = results.filter((r) => r.status === 'rejected')
    if (failures.length > 0) {
      console.error('Some game assignment change emails failed:', failures)
    }

    res.status(200).send({ result: `sent ${results.length - failures.length} of ${results.length} emails` })
  } catch (err: any) {
    handleError(err, res)
  }
})
