import { ContentsOf, UnpackArray } from '../utils'
import type { GetGamesBySlotQuery, GetScheduleQuery } from './graphql'

export * from './error'
export * from './graphql'

export type GameArray = NonNullable<GetGamesBySlotQuery['games']>['edges']
export type GameEntry = NonNullable<Omit<UnpackArray<GameArray>, '__typename'>['node']>

export type GameAssignmentNode = Omit<
  Omit<ContentsOf<ContentsOf<GetScheduleQuery, 'gameAssignments'>, 'nodes'>, '__typename'>,
  'nodeId'
> & { nodeId?: string }
