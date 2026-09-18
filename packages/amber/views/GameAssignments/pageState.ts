export type GameAssignmentsPaneId = 'byGame' | 'byMember' | 'choices' | 'interest'
export type GameAssignmentsLayoutMode = 'grid' | 'columns' | 'rows'
export type GameAssignmentsPaneSlotFilters = Record<GameAssignmentsPaneId, number | null>
export type GameAssignmentsTopSlotFilterId = number | null | 'mixed'
export type GameAssignmentsMinimizedPaneIds = Array<GameAssignmentsPaneId>

export const gameAssignmentsPaneIds = [
  'byGame',
  'byMember',
  'choices',
  'interest',
] as const satisfies ReadonlyArray<GameAssignmentsPaneId>

export const buildGameAssignmentsSlotFilterOptions = (numberOfSlots: number) =>
  Array.from({ length: numberOfSlots }, (_unusedValue: undefined, slotIndex: number) => slotIndex + 1)

const buildPaneSlotFilters = (
  getSlotFilterId: (paneId: GameAssignmentsPaneId) => number | null,
): GameAssignmentsPaneSlotFilters =>
  Object.fromEntries(
    gameAssignmentsPaneIds.map((paneId) => [paneId, getSlotFilterId(paneId)]),
  ) as GameAssignmentsPaneSlotFilters

export const buildUniformPaneSlotFilters = (slotFilterId: number | null): GameAssignmentsPaneSlotFilters =>
  buildPaneSlotFilters(() => slotFilterId)

export const buildDefaultPaneSlotFilters = (): GameAssignmentsPaneSlotFilters => buildUniformPaneSlotFilters(null)

export const sanitizeGameAssignmentsMinimizedPaneIds = (value: unknown): GameAssignmentsMinimizedPaneIds => {
  if (!Array.isArray(value)) return []

  const paneIdSet = new Set(
    value.filter(
      (paneId): paneId is GameAssignmentsPaneId =>
        typeof paneId === 'string' && gameAssignmentsPaneIds.includes(paneId as GameAssignmentsPaneId),
    ),
  )

  return gameAssignmentsPaneIds.filter((paneId) => paneIdSet.has(paneId)).slice(0, gameAssignmentsPaneIds.length - 1)
}

export const doMinimizedPaneIdsMatchStoredValue = (value: unknown, expected: GameAssignmentsMinimizedPaneIds) =>
  Array.isArray(value) && value.length === expected.length && value.every((paneId, index) => paneId === expected[index])

export const toggleGameAssignmentsPaneMinimized = ({
  minimizedPaneIds,
  paneId,
}: {
  minimizedPaneIds: GameAssignmentsMinimizedPaneIds
  paneId: GameAssignmentsPaneId
}): GameAssignmentsMinimizedPaneIds => {
  if (minimizedPaneIds.includes(paneId)) {
    return minimizedPaneIds.filter((minimizedPaneId) => minimizedPaneId !== paneId)
  }

  if (minimizedPaneIds.length >= gameAssignmentsPaneIds.length - 1) return minimizedPaneIds

  return sanitizeGameAssignmentsMinimizedPaneIds([...minimizedPaneIds, paneId])
}

export const buildUpdatedPaneSlotFilters = ({
  paneSlotFilters,
  paneId,
  slotFilterId,
}: {
  paneSlotFilters: GameAssignmentsPaneSlotFilters
  paneId: GameAssignmentsPaneId
  slotFilterId: number | null
}): GameAssignmentsPaneSlotFilters =>
  buildPaneSlotFilters((currentPaneId) => (currentPaneId === paneId ? slotFilterId : paneSlotFilters[currentPaneId]))

export const sanitizeGameAssignmentsLayoutMode = (value: unknown): GameAssignmentsLayoutMode =>
  value === 'grid' || value === 'columns' || value === 'rows' ? value : 'grid'

export const sanitizeGameAssignmentsPaneId = (value: unknown): GameAssignmentsPaneId | null =>
  typeof value === 'string' && gameAssignmentsPaneIds.includes(value as GameAssignmentsPaneId)
    ? (value as GameAssignmentsPaneId)
    : null

const sanitizeOptionalSlotFilterId = (value: unknown, slotFilterOptions: Array<number>): number | null => {
  if (value === null) {
    return null
  }

  if (typeof value !== 'number' || !Number.isInteger(value)) {
    return null
  }

  return slotFilterOptions.includes(value) ? value : null
}

export const sanitizeGameAssignmentsPaneSlotFilters = (
  value: unknown,
  slotFilterOptions: Array<number>,
): GameAssignmentsPaneSlotFilters => {
  if (!value || typeof value !== 'object') {
    return buildDefaultPaneSlotFilters()
  }

  const typedValue = value as Partial<Record<GameAssignmentsPaneId, unknown>>

  return buildPaneSlotFilters((paneId) => sanitizeOptionalSlotFilterId(typedValue[paneId], slotFilterOptions))
}

export const doPaneSlotFiltersMatchStoredValue = (
  value: unknown,
  expected: GameAssignmentsPaneSlotFilters,
): boolean => {
  if (!value || typeof value !== 'object') {
    return false
  }

  const typedValue = value as Partial<Record<GameAssignmentsPaneId, unknown>>

  return gameAssignmentsPaneIds.every((paneId) => typedValue[paneId] === expected[paneId])
}

export const getTopSlotFilterId = (paneSlotFilters: GameAssignmentsPaneSlotFilters): GameAssignmentsTopSlotFilterId => {
  const values = gameAssignmentsPaneIds.map((paneId) => paneSlotFilters[paneId])
  const firstValue = values[0]

  return values.every((value) => value === firstValue) ? firstValue : 'mixed'
}
