import { UnpackArray } from '../utils'
import type { GetGamesBySlotQuery } from './graphql'

export * from './graphql'

export type GameArray = NonNullable<GetGamesBySlotQuery['games']>['edges']
export type GameEntry = NonNullable<Omit<UnpackArray<GameArray>, '__typename'>['node']>
