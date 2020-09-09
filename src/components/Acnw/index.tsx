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
export * from './YearTile'

const Ordinal = () => <>{getOrdinalWord(1 + configuration.year - 1997)}</>

const RegistrationDeadline = () => <>{configuration.registrationDeadline.toLocaleString(DateTime.DATE_MED)}</>

const ConventionYear = () => <>{configuration.year}</>

const PaymentDeadline = () => <>{configuration.paymentDeadline.toLocaleString(DateTime.DATE_MED)}</>

const GameSubmissionDeadline = () => <>{configuration.gameSubmissionDeadline.toLocaleString(DateTime.DATE_MED)}</>

const SimoneEmail = () => <>{configuration.simEmail}</>

const defaults = { Ordinal, RegistrationDeadline, ConventionYear, PaymentDeadline, GameSubmissionDeadline, SimoneEmail }
export default defaults
