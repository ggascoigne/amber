import type {
  DashboardAssignment,
  DashboardChoice,
  DashboardGame,
  DashboardMembership,
  DashboardSubmission,
} from './types'

import type { Configuration } from '../../../utils'

export const buildGame = ({
  id,
  playerMin,
  playerMax,
  slotId = 1,
  category = 'user',
  name = `Game ${id}`,
  playerPreference = '',
}: {
  id: number
  playerMin: number
  playerMax: number
  slotId?: number | null
  category?: string
  name?: string
  playerPreference?: string
}) => ({ id, name, playerMin, playerMax, slotId, category, playerPreference }) as DashboardGame

export const buildAssignment = ({
  memberId,
  gameId,
  gm,
  slotId,
  year = 2026,
  category = 'user',
}: {
  memberId: number
  gameId: number
  gm: number
  slotId?: number
  year?: number
  category?: string
}) =>
  ({
    memberId,
    gameId,
    gm,
    year,
    game: {
      id: gameId,
      message: '',
      name: `Game ${gameId}`,
      playerMax: 4,
      playerMin: 2,
      playerPreference: '',
      returningPlayers: '',
      slotId: slotId ?? null,
      category,
      year,
    } as DashboardGame,
    membership: {
      id: memberId,
      user: {
        fullName: `Member ${memberId}`,
      },
    },
  }) as DashboardAssignment

export const buildChoice = ({
  memberId,
  slotId,
  gameId,
  rank,
  returningPlayer = false,
  fullName = `Member ${memberId}`,
}: {
  memberId: number
  slotId: number
  gameId: number
  rank: number
  returningPlayer?: boolean
  fullName?: string | null
}) =>
  ({
    memberId,
    slotId,
    gameId,
    rank,
    returningPlayer,
    membership: {
      user: {
        fullName,
      },
    },
  }) as DashboardChoice

export const buildConfiguration = (numberOfSlots: number) => ({ numberOfSlots }) as Configuration

export const buildMembership = ({
  id,
  attending = true,
  fullName = `Member ${id}`,
}: {
  id: number
  attending?: boolean
  fullName?: string | null
}) =>
  ({
    id,
    attending,
    user: {
      fullName,
    },
  }) as DashboardMembership

export const buildSubmission = ({ memberId, message = '' }: { memberId: number; message?: string }) =>
  ({
    memberId,
    message,
  }) as DashboardSubmission
