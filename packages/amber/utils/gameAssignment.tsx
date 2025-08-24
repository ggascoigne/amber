import { Schedule } from '@amber/client'

export const getGameAssignments = (data: Schedule[] | undefined, memberId: number, gmOnly = false): Schedule[] =>
  ((data ?? [])
    .concat()
    // drop games with zero players/gms
    .filter((g) => (g?.game?.gameAssignment.length ?? 0) > 0 && g?.game?.slotId)
    // is showing only GMs then drop all games where the user isn't the GM
    .filter((g) =>
      gmOnly ? g?.game?.gameAssignment.find((g1) => (g1?.gm ?? 0) > 0 && g1?.memberId === memberId) : true,
    )
    .sort((a, b) => (a?.game?.slotId ?? 0) - (b?.game?.slotId ?? 0)) ?? []) as Schedule[]
