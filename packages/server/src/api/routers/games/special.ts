import type { Prisma } from '../../../generated/prisma/client'

export type SpecialGameTemplate = Omit<Prisma.GameCreateManyInput, 'slotId' | 'year' | 'category'>

type ExistingSpecialGame = {
  category: string
  slotId: number | null
}

type NoGameTemplateRecord = SpecialGameTemplate & {
  slotId: number | null
}

type SlotRecord = {
  id: number
}

export const specialGameTemplateSelect = {
  description: true,
  lateFinish: true,
  lateStart: true,
  name: true,
  playerMax: true,
  playerMin: true,
  roomId: true,
  shortName: true,
  charInstructions: true,
  estimatedLength: true,
  gameContactEmail: true,
  genre: true,
  gmNames: true,
  message: true,
  playerPreference: true,
  playersContactGm: true,
  returningPlayers: true,
  setting: true,
  slotConflicts: true,
  slotPreference: true,
  teenFriendly: true,
  type: true,
  authorId: true,
  full: true,
} satisfies Prisma.GameSelect

const defaultNoGameTemplate: SpecialGameTemplate = {
  description: 'I am taking this slot off.',
  lateFinish: false,
  lateStart: null,
  name: 'No Game',
  playerMax: 999,
  playerMin: 0,
  roomId: null,
  shortName: null,
  charInstructions: '',
  estimatedLength: 'n/a',
  gameContactEmail: '',
  genre: 'other',
  gmNames: null,
  message: '',
  playerPreference: 'Any',
  playersContactGm: false,
  returningPlayers: '',
  setting: '',
  slotConflicts: '',
  slotPreference: 0,
  teenFriendly: true,
  type: 'Other',
  authorId: null,
  full: false,
}

const defaultAnyGameTemplate: SpecialGameTemplate = {
  ...defaultNoGameTemplate,
  description: 'Assign me to any game in this slot.',
  name: 'Any Game',
}

const buildNoGameCreateInput = (
  template: SpecialGameTemplate,
  slotId: number,
  year: number,
): Prisma.GameCreateManyInput => ({
  ...template,
  slotId,
  year,
  category: 'no_game',
})

const buildAnyGameCreateInput = (template: SpecialGameTemplate, year: number): Prisma.GameUncheckedCreateInput => ({
  ...template,
  slotId: null,
  year,
  category: 'any_game',
})

const buildExistingNoGameSlotIds = (existingSpecialGames: Array<ExistingSpecialGame>) =>
  new Set(
    existingSpecialGames
      .filter((game) => game.category === 'no_game' && (game.slotId ?? 0) > 0)
      .map((game) => game.slotId as number),
  )

const buildNoGameTemplateBySlotId = (noGameTemplates: Array<NoGameTemplateRecord>) => {
  const noGameTemplateBySlotId = new Map<number, SpecialGameTemplate>()

  noGameTemplates.forEach((game) => {
    if ((game.slotId ?? 0) <= 0 || noGameTemplateBySlotId.has(game.slotId as number)) {
      return
    }

    const { slotId: _slotId, ...template } = game
    noGameTemplateBySlotId.set(game.slotId as number, template)
  })

  return noGameTemplateBySlotId
}

export const buildSpecialGameCreationPlan = ({
  anyGameTemplate,
  existingSpecialGames,
  noGameTemplates,
  slots,
  year,
}: {
  anyGameTemplate: SpecialGameTemplate | null
  existingSpecialGames: Array<ExistingSpecialGame>
  noGameTemplates: Array<NoGameTemplateRecord>
  slots: Array<SlotRecord>
  year: number
}): {
  anyGameCreate: Prisma.GameUncheckedCreateInput | null
  noGameCreates: Array<Prisma.GameCreateManyInput>
} => {
  const existingNoGameSlotIds = buildExistingNoGameSlotIds(existingSpecialGames)
  const hasAnyGame = existingSpecialGames.some((game) => game.category === 'any_game')
  const noGameTemplateBySlotId = buildNoGameTemplateBySlotId(noGameTemplates)

  const noGameCreates = slots
    .filter((slot) => !existingNoGameSlotIds.has(slot.id))
    .map((slot) => buildNoGameCreateInput(noGameTemplateBySlotId.get(slot.id) ?? defaultNoGameTemplate, slot.id, year))

  return {
    noGameCreates,
    anyGameCreate: hasAnyGame ? null : buildAnyGameCreateInput(anyGameTemplate ?? defaultAnyGameTemplate, year),
  }
}
