import { GameAssignmentNode, GetScheduleQuery } from '../client'

export const getGameAssignments = (
  data: GetScheduleQuery | undefined,
  memberId: number,
  gmOnly = false
): GameAssignmentNode[] =>
  (data?.gameAssignments?.nodes
    ?.concat()
    // drop games with zero players/gms
    .filter((g) => (g?.game?.gameAssignments?.nodes?.length ?? 0) > 0)
    // is showing only GMs then drop all games where the user isn't the GM
    .filter((g) =>
      gmOnly ? g?.game?.gameAssignments?.nodes?.find((g1) => (g1?.gm ?? 0) > 0 && g1?.memberId === memberId) : true
    )
    .sort((a, b) => (a?.game?.slotId ?? 0) - (b?.game?.slotId ?? 0)) ?? []) as GameAssignmentNode[]
