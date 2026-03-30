import { getEmailer, sendTemplateEmail } from './mailer'
import type { EmailSendResult, RuntimeSettings } from './types'

import type { MembershipConfirmationBody } from '../../contracts/email'

const roomPreferenceLabels: Record<string, string> = {
  other: 'None',
  'room-with': 'I will be rooming with (list names)',
}

const formatDate = (value: string) => {
  const date = new Date(value)
  return Number.isNaN(date.valueOf())
    ? ''
    : new Intl.DateTimeFormat('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }).format(date)
}

const getAttendanceLabel = (abbr: 'acnw' | 'acus', value: string) => {
  if (abbr === 'acus') {
    return {
      '1': '1 Day: $25.00',
      '2': '2 Day: $40.00',
      '3': '3 Day: $55.00',
      '4': '4 Day: $70.00',
    }[value]
  }

  return {
    'Thurs-Sun': 'Full, Thursday - Sunday',
    'Fri-Sun': 'Short, Friday - Sunday',
  }[value]
}

const getInterestLevelLabel = (deposit: number, paymentDeadline: Date, value: string) => {
  const deadline = new Intl.DateTimeFormat('en-US', { dateStyle: 'medium' }).format(paymentDeadline)
  return {
    Deposit: `I am paying a deposit of $${deposit}.00 now. I understand payment in full is due ${deadline}.`,
    Full: 'I am sending payment in full now',
  }[value]
}

const getRoomPreferenceLabel = (value: string) => roomPreferenceLabels[value] ?? value

export const sendMembershipConfirmation = async (
  body: MembershipConfirmationBody,
  settings: RuntimeSettings,
): Promise<EmailSendResult> => {
  const emailer = await getEmailer()
  const emailResults = body.map((item) =>
    sendTemplateEmail(emailer, {
      locals: {
        ...item,
        membership: {
          ...item.membership,
          arrivalDate: formatDate(item.membership.arrivalDate),
          attendance: getAttendanceLabel(settings.abbr, item.membership.attendance) ?? item.membership.attendance,
          departureDate: formatDate(item.membership.departureDate),
          interestLevel:
            getInterestLevelLabel(
              settings.deposit,
              settings.paymentDeadline.toJSDate(),
              item.membership.interestLevel,
            ) ?? item.membership.interestLevel,
          roomingPreferences: getRoomPreferenceLabel(item.membership.roomingPreferences),
        },
        owed: item.owed,
      },
      message: {
        cc: settings.contactEmail,
        to: item.email,
      },
      template: 'membershipConfirmation',
    }),
  )

  const results = await Promise.allSettled(emailResults)
  return {
    sentCount: results.filter((result) => result.status === 'fulfilled').length,
  }
}
