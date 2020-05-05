import { GetGamesBySlotQuery } from './graphql'

export * from './resolvers'
export * from './graphql'

export type GameArray = NonNullable<GetGamesBySlotQuery['games']>['edges']
