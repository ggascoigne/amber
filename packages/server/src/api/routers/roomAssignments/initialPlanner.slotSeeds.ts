import type { InitialPlannerExistingAssignment } from './initialPlanner'
import type { PlannedGameContext, PlannerSeedData } from './initialPlanner.seed'

export type SlotPlanningSeed = {
  slotId: number
  existingFixedAssignments: Array<InitialPlannerExistingAssignment>
  gamesForSlot: Array<PlannedGameContext>
}

const sortGamesForPlanning = (games: Array<PlannedGameContext>) =>
  [...games].sort(
    (left, right) =>
      right.participantCount - left.participantCount ||
      left.game.name.localeCompare(right.game.name) ||
      left.game.id - right.game.id,
  )

const buildUnlockedGamesForSlot = ({ seedData, slotId }: { seedData: PlannerSeedData; slotId: number }) =>
  sortGamesForPlanning(seedData.plannedGamesBySlotId.get(slotId) ?? []).filter(
    ({ game }) => !seedData.lockedGameIds.has(game.id),
  )

const buildSlotPlanningSeed = ({
  seedData,
  slotId,
}: {
  seedData: PlannerSeedData
  slotId: number
}): SlotPlanningSeed => ({
  slotId,
  existingFixedAssignments: seedData.existingFixedAssignmentsBySlotId.get(slotId) ?? [],
  gamesForSlot: buildUnlockedGamesForSlot({
    seedData,
    slotId,
  }),
})

export const buildSlotPlanningSeeds = (seedData: PlannerSeedData): Array<SlotPlanningSeed> =>
  [...seedData.plannedGamesBySlotId.keys()]
    .sort((left, right) => left - right)
    .map((slotId) =>
      buildSlotPlanningSeed({
        seedData,
        slotId,
      }),
    )
