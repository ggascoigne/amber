import { ssrHelpers } from '@amber/server/src/api/ssr'

import { UserPaymentDetails } from './types'

import { emailer } from '../email/email'
import { getEmails } from '../getConfig'

type SendEmailConfirmationProps = {
  userId: number
  year: number
  amount: number
  paymentInfo: UserPaymentDetails[]
}

export const sendEmailConfirmation = async ({ userId, year, amount, paymentInfo }: SendEmailConfirmationProps) => {
  const emails = await getEmails()

  try {
    const paymentDetailsPromises = paymentInfo
      ? paymentInfo.map((pi) =>
          ssrHelpers.users.getUser.fetch({
            id: pi.userId,
          }),
        )
      : [
          ssrHelpers.users.getUser.fetch({
            id: userId,
          }),
        ]

    let paymentDetails: { name: string; email: string; amount: string }[]

    await Promise.allSettled(paymentDetailsPromises).then(async (res) => {
      const successes = res.filter((r) => r.status === 'fulfilled')
      const failureCount = res.length - successes.length
      if (failureCount) {
        console.warn('Reading User details failed', res)
      }
      paymentDetails = successes.map((r) => {
        const id = r.value?.id
        const userPaymentRecord = paymentInfo.find((p) => p.userId === id)
        return {
          name: r.value?.fullName ?? '',
          email: r.value?.email ?? '',
          amount: `${userPaymentRecord?.total}`,
        }
      })

      const result = await emailer.send({
        template: 'paymentConfirmation',
        message: {
          to: paymentDetails?.[0]?.email,
          cc: emails.contactEmail,
        },
        locals: {
          name: paymentDetails?.[0]?.name,
          year,
          amount,
          paymentDetails,
          ...emails,
        },
      })
      console.log({ result })
    })
  } catch (err: any) {
    console.log('error sending payment email', err)
  }
}
