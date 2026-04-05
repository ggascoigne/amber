import type { UserPaymentDetails } from './types'

import { db } from '../../../db'
import { ssrAuthenticatedHelpers } from '../../ssr'
import { getEmailer, sendTemplateEmail } from '../emails/mailer'
import { getRuntimeSettingsTx } from '../runtimeSettings'

type SendPaymentConfirmationProps = {
  amount: number
  paymentInfo: UserPaymentDetails[]
  userId: number
  year: number
}

export const sendPaymentConfirmation = async ({ userId, year, amount, paymentInfo }: SendPaymentConfirmationProps) => {
  const settings = await db.$transaction((tx) => getRuntimeSettingsTx(tx))
  const emailer = await getEmailer()
  const ssrHelpers = ssrAuthenticatedHelpers(userId)

  try {
    const paymentDetailsPromises =
      paymentInfo.length > 0
        ? paymentInfo.map((payment) =>
            ssrHelpers.users.getUser.fetch({
              id: payment.userId,
            }),
          )
        : [
            ssrHelpers.users.getUser.fetch({
              id: userId,
            }),
          ]

    await Promise.allSettled(paymentDetailsPromises).then(async (results) => {
      const successes = results.filter((result) => result.status === 'fulfilled')
      const failureCount = results.length - successes.length
      if (failureCount) {
        console.warn('Reading User details failed', results)
      }

      const paymentDetails = successes.map((result) => {
        const user = result.value
        const userPaymentRecord = paymentInfo.find((payment) => payment.userId === user?.id)
        return {
          amount: `${userPaymentRecord?.total ?? amount}`,
          email: user?.email ?? '',
          name: user?.fullName ?? '',
        }
      })

      await sendTemplateEmail(emailer, {
        locals: {
          amount,
          contactEmail: settings.contactEmail,
          name: paymentDetails[0]?.name ?? '',
          paymentDetails,
          year,
        },
        message: {
          cc: settings.contactEmail,
          to: paymentDetails[0]?.email ?? '',
        },
        template: 'paymentConfirmation',
      })
    })
  } catch (error) {
    console.log('error sending payment email', error)
  }
}
