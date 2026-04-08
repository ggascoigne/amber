import type { EnsureSpecialGamesForYearInput } from './schemas'
import { buildSpecialGameCreationPlan, specialGameTemplateSelect } from './special'

import type { TransactionClient } from '../../inRlsTransaction'

const existingSpecialGameSelect = {
  slotId: true,
  category: true,
}

const noGameTemplateSelect = {
  ...specialGameTemplateSelect,
  slotId: true,
}

export const ensureSpecialGamesForYear = async ({
  tx,
  input,
}: {
  tx: TransactionClient
  input: EnsureSpecialGamesForYearInput
}) => {
  const [slots, existingSpecialGames, noGameTemplates, anyGameTemplate] = await Promise.all([
    tx.slot.findMany({
      select: { id: true },
      orderBy: [{ id: 'asc' }],
    }),
    tx.game.findMany({
      where: {
        year: input.year,
        category: {
          in: ['no_game', 'any_game'],
        },
      },
      select: existingSpecialGameSelect,
    }),
    tx.game.findMany({
      where: {
        category: 'no_game',
        slotId: { not: null },
      },
      select: noGameTemplateSelect,
      orderBy: [{ year: 'desc' }, { id: 'desc' }],
    }),
    tx.game.findFirst({
      where: { category: 'any_game' },
      select: specialGameTemplateSelect,
      orderBy: [{ year: 'desc' }, { id: 'desc' }],
    }),
  ])

  const { anyGameCreate, noGameCreates } = buildSpecialGameCreationPlan({
    slots,
    existingSpecialGames,
    noGameTemplates,
    anyGameTemplate,
    year: input.year,
  })

  if (noGameCreates.length > 0) {
    await tx.game.createMany({
      data: noGameCreates,
    })
  }

  if (anyGameCreate) {
    await tx.game.create({
      data: anyGameCreate,
    })
  }

  return {
    createdNoGameCount: noGameCreates.length,
    createdAnyGameCount: anyGameCreate ? 1 : 0,
  }
}
