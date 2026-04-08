import type {
  GetGameByIdInput,
  GetGamesByAuthorInput,
  GetGamesBySlotInput,
  GetGamesByYearAndAuthorInput,
  GetGamesByYearInput,
} from './schemas'

import type { Prisma } from '../../../generated/prisma/client'
import type { TransactionClient } from '../../inRlsTransaction'

const gmOfferUserSelect = {
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
} satisfies Prisma.GameAssignmentSelect

export const gameWithGmsAndRoomInclude = {
  room: {
    select: {
      description: true,
    },
  },
  gameAssignment: {
    where: { gm: { lt: 0 } },
    select: {
      gameId: true,
      gm: true,
      memberId: true,
      year: true,
      ...gmOfferUserSelect,
    },
  },
} satisfies Prisma.GameInclude

export const firstGameOfSlotInclude = {
  ...gameWithGmsAndRoomInclude,
  gameAssignment: {
    where: { gm: { lt: 0 } },
    include: {
      membership: {
        include: {
          user: {
            select: {
              email: true,
              fullName: true,
            },
          },
        },
      },
    },
  },
} satisfies Prisma.GameInclude

export const getGamesBySlotForSignup = ({ tx, input }: { tx: TransactionClient; input: GetGamesBySlotInput }) =>
  tx.game.findMany({
    where: {
      year: input.year,
      OR: [{ slotId: input.slotId }, { category: 'any_game' }],
    },
    orderBy: [{ category: 'asc' }, { name: 'asc' }],
    include: gameWithGmsAndRoomInclude,
  })

export const getGamesBySlot = ({ tx, input }: { tx: TransactionClient; input: GetGamesBySlotInput }) =>
  tx.game.findMany({
    where: {
      year: input.year,
      slotId: input.slotId,
      category: 'user',
    },
    orderBy: [{ slotId: 'asc' }, { name: 'asc' }],
    include: gameWithGmsAndRoomInclude,
  })

export const getGamesByYear = ({ tx, input }: { tx: TransactionClient; input: GetGamesByYearInput }) =>
  tx.game.findMany({
    where: {
      year: input.year,
    },
    orderBy: [{ slotId: 'asc' }, { name: 'asc' }],
    include: gameWithGmsAndRoomInclude,
  })

export const getSmallGamesByYear = ({ tx, input }: { tx: TransactionClient; input: GetGamesByYearInput }) =>
  tx.game.findMany({
    where: {
      year: input.year,
      category: 'user',
    },
    orderBy: [{ slotId: 'asc' }, { name: 'asc' }],
    take: 1,
    include: gameWithGmsAndRoomInclude,
  })

export const getFirstGameOfSlot = ({ tx, input }: { tx: TransactionClient; input: GetGamesByYearInput }) =>
  tx.game.findMany({
    where: {
      slotId: 1,
      year: input.year,
      category: 'user',
    },
    orderBy: [{ name: 'asc' }],
    take: 1,
    include: firstGameOfSlotInclude,
  })

export const getGamesByAuthor = ({ tx, input }: { tx: TransactionClient; input: GetGamesByAuthorInput }) =>
  tx.game.findMany({
    where: { authorId: input.id },
    include: gameWithGmsAndRoomInclude,
  })

export const getGamesByYearAndAuthor = ({
  tx,
  input,
}: {
  tx: TransactionClient
  input: GetGamesByYearAndAuthorInput
}) =>
  tx.game.findMany({
    where: {
      authorId: input.id,
      year: input.year,
    },
    include: gameWithGmsAndRoomInclude,
  })

export const getGameById = ({ tx, input }: { tx: TransactionClient; input: GetGameByIdInput }) =>
  tx.game.findUnique({
    where: { id: input.id },
    include: gameWithGmsAndRoomInclude,
  })
