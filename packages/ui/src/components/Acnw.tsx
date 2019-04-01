import * as React from 'react'

import configurationService from '../utils/ConfigurationService'
import getOrdinalWord from '../utils/ordinal'

const Ordinal = () => <>{getOrdinalWord(1 + configurationService.year - 1997)}</>

const RegistrationDeadline = () => <>{configurationService.registrationDeadline}</>

const ConventionYear = () => <>{configurationService.year}</>

const PaymentDeadline = () => <>{configurationService.paymentDeadline}</>

const GameSubmissionDeadline = () => <>{configurationService.gameSubmissionDeadline}</>

const SimoneEmail = () => <>{configurationService.simEmail}</>

export default { Ordinal, RegistrationDeadline, ConventionYear, PaymentDeadline, GameSubmissionDeadline, SimoneEmail }
