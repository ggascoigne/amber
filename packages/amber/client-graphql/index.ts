import { ContentsOf, UnpackArray } from 'ui'

import type { GetGamesBySlotQuery, GetScheduleQuery } from '../../client-graphql/src'

export * from './error'
export * from './useGraphQL'
export * from '../../client-graphql/src'

export type GameArray = NonNullable<GetGamesBySlotQuery['games']>['edges']
export type GameEntry = NonNullable<Omit<UnpackArray<GameArray>, '__typename'>['node']>

export type GameAssignmentNode = Omit<
  Omit<ContentsOf<ContentsOf<GetScheduleQuery, 'gameAssignments'>, 'nodes'>, '__typename'>,
  'nodeId'
> & { nodeId?: string }
