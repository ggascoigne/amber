import type { GetGamesBySlotQuery, GetScheduleQuery } from '@amber/client'
import { ContentsOf, UnpackArray } from 'ui'

export * from './error'
export * from './useGraphQL'
export * from '@amber/client'

export type GameArray = NonNullable<GetGamesBySlotQuery['games']>['edges']
export type GameEntry = NonNullable<Omit<UnpackArray<GameArray>, '__typename'>['node']>

export type GameAssignmentNode = Omit<
  Omit<ContentsOf<ContentsOf<GetScheduleQuery, 'gameAssignments'>, 'nodes'>, '__typename'>,
  'nodeId'
> & { nodeId?: string }
