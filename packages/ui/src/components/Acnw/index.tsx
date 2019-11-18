import * as React from 'react'

import configurationService from '../../utils/ConfigurationService'
import getOrdinalWord from '../../utils/ordinal'

export * from './Auth'
export * from './Banner'
export * from './Dialog'
export * from './ErrorBoundary'
export * from './GameCard'
export * from './GameList'
export * from './GameQuery'
export * from './GraphQLError'
export * from './Loader'
export * from './LoginMenu'
export * from './Lookup'
export * from './Navigation'
export * from './Page'
export * from './SlotSelector'
export * from './Table'
export * from './YearTile'

const Ordinal = () => <>{getOrdinalWord(1 + configurationService.year - 1997)}</>

const RegistrationDeadline = () => <>{configurationService.registrationDeadline}</>

const ConventionYear = () => <>{configurationService.year}</>

const PaymentDeadline = () => <>{configurationService.paymentDeadline}</>

const GameSubmissionDeadline = () => <>{configurationService.gameSubmissionDeadline}</>

const SimoneEmail = () => <>{configurationService.simEmail}</>

export default { Ordinal, RegistrationDeadline, ConventionYear, PaymentDeadline, GameSubmissionDeadline, SimoneEmail }
