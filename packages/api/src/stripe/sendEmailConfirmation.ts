import { GetUserByIdDocument, GetUserByIdQuery, GetUserByIdQueryVariables } from '@amber/client'
import { makeQueryRunner, QueryResult } from 'database/shared/postgraphileQueryRunner'

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
  const { query, release } = await makeQueryRunner()

  try {
    const paymentDetailsPromises = paymentInfo
      ? paymentInfo.map((pi) =>
          query<GetUserByIdQuery, GetUserByIdQueryVariables>(GetUserByIdDocument, {
            id: pi.userId,
          }),
        )
      : [
          query<GetUserByIdQuery, GetUserByIdQueryVariables>(GetUserByIdDocument, {
            id: userId,
          }),
        ]

    let paymentDetails: { name: string; email: string; amount: string }[]

    await Promise.allSettled(paymentDetailsPromises).then(async (res) => {
      const successes = res.filter((r) => r.status === 'fulfilled') as PromiseFulfilledResult<
        QueryResult<GetUserByIdQuery>
      >[]
      const failureCount = res.length - successes.length
      if (failureCount) {
        console.warn('Reading User details failed', res)
      }
      paymentDetails = successes.map((r) => {
        const id = r.value.data.user?.id
        const userPaymentRecord = paymentInfo.find((p) => p.userId === id)
        return {
          name: r.value.data.user?.fullName ?? '',
          email: r.value.data.user?.email ?? '',
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
  } finally {
    release()
  }
}
