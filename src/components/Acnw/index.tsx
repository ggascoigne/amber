import { DateTime } from 'luxon'
import * as React from 'react'
import { configuration } from 'utils'
import getOrdinalWord from 'utils/ordinal'

export * from './Auth'
export * from './Banner'
export * from './Dialog'
export * from './ErrorBoundary'
export * from './Form'
export * from './GameCard'
export * from './GameList'
export * from './GameQuery'
export * from './GraphQLError'
export * from './Grid'
export * from './Header'
export * from './Loader'
export * from './LoginMenu'
export * from './Lookup'
export * from './Navigation'
export * from './Page'
export * from './Profile'
export * from './SlotSelector'
export * from './Table'
export * from './UserSelector'
export * from './YearTile'

const Ordinal = () => <>{getOrdinalWord(1 + configuration.year - 1997)}</>

const ConventionYear = () => <>{configuration.year}</>

export const ConfigDate = ({ name }: { name: keyof typeof configuration }) => (
  <>{(configuration[name] as DateTime).toLocaleString(DateTime.DATE_MED)}</>
)

const ContactEmail = () => <>{configuration.contactEmail}</>

const defaults = { Ordinal, ConventionYear, ContactEmail }
export default defaults
