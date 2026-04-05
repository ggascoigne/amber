import { getEmailer, sendTemplateEmail } from './mailer'
import type { EmailSendResult, RuntimeSettings } from './types'

import type { GameChoiceConfirmationBody } from '../../contracts/email'

export const sendGameChoiceConfirmation = async (
  body: GameChoiceConfirmationBody,
  settings: RuntimeSettings,
): Promise<EmailSendResult> => {
  const emailer = await getEmailer()
  const gameChoices = Object.values(body.gameChoiceDetails).sort(
    (left: { slotId: number }, right: { slotId: number }) => left.slotId - right.slotId,
  )

  await sendTemplateEmail(emailer, {
    locals: {
      ...body,
      contactEmail: settings.contactEmail,
      gameChoices,
      gameEmail: settings.gameEmail,
    },
    message: body.update
      ? {
          to: settings.contactEmail,
        }
      : {
          cc: settings.contactEmail,
          to: body.email,
        },
    template: 'gameChoiceConfirmation',
  })

  return { sentCount: 1 }
}
