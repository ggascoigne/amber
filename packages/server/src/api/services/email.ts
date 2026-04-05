import { sendGameAssignmentChange } from './emails/gameAssignmentChange'
import { sendGameChoiceConfirmation } from './emails/gameChoiceConfirmation'
import { sendGameConfirmation } from './emails/gameConfirmation'
import { sendMembershipConfirmation } from './emails/membershipConfirmation'
import { getRuntimeSettingsTx } from './runtimeSettings'

import type { Context } from '../context'
import type { SendEmailInput } from '../contracts/email'
import { inRlsTransaction } from '../inRlsTransaction'

export const sendEmail = async (ctx: Context, input: SendEmailInput) =>
  inRlsTransaction(ctx, async (tx) => {
    const settings = await getRuntimeSettingsTx(tx)

    switch (input.type) {
      case 'membershipConfirmation':
        return sendMembershipConfirmation(input.body, settings)
      case 'gameConfirmation':
        return sendGameConfirmation(input.body, settings)
      case 'gameChoiceConfirmation':
        return sendGameChoiceConfirmation(input.body, settings)
      case 'gameAssignmentChange':
        return sendGameAssignmentChange(ctx, input.body, settings)
      default:
        return { sentCount: 0 }
    }
  })
