import { getEmailer, sendTemplateEmail } from './mailer'
import type { EmailSendResult, RuntimeSettings } from './types'

import type { GameConfirmationBody } from '../../contracts/email'

const playerPreferenceLabels: Record<string, string> = {
  any: 'Any',
  'ret-only': 'Returning players only',
  'ret-pref': 'Returning players have preference, new players welcome.',
}

const getPlayerPreferenceLabel = (value: string) => playerPreferenceLabels[value] ?? value

export const sendGameConfirmation = async (
  body: GameConfirmationBody,
  settings: RuntimeSettings,
): Promise<EmailSendResult> => {
  const emailer = await getEmailer()

  await sendTemplateEmail(emailer, {
    locals: {
      ...body,
      contactEmail: settings.contactEmail,
      game: {
        ...body.game,
        playerPreference: body.game.playerPreference
          ? getPlayerPreferenceLabel(body.game.playerPreference)
          : body.game.playerPreference,
      },
      gameEmail: settings.gameEmail,
    },
    message: body.update
      ? {
          to: settings.gameEmail,
        }
      : {
          cc: settings.gameEmail,
          to: body.email,
        },
    template: 'gameConfirmation',
  })

  return { sentCount: 1 }
}
