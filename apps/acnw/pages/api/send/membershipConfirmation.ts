import { formatDate, getAttendance, getInterestLevel, getRoomPref } from '@amber/amber/utils'
import { membershipConfirmationSchema } from '@amber/amber/utils/apiTypes'
import { getConfig, getEmails, emailer, handleError, JsonError } from '@amber/api'
import { auth0 } from '@amber/server/src/auth/auth0'
import debug from 'debug'
import type { NextApiRequest, NextApiResponse } from 'next'

const log = debug('amber:acnw:api:send:membershipConfirmation')

// /api/send/membershipConfirmation
// auth token: required
// body: {
//  year: number
//  name: string
//  email: string
//  url: string
//  paymentUrl: string
//  membership: Membership
//  update?; boolean
// }

export default auth0.withApiAuthRequired(async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    if (!req.body)
      throw new JsonError(400, 'missing body: expecting year, name, email, url, membership, slotDescriptions')
    const configuration = await getConfig()
    if (!configuration) throw new JsonError(400, 'unable to load configuration')
    const emails = await getEmails()
    const values = membershipConfirmationSchema.parse(req.body)

    const emailResults = values.map((v) => {
      const {
        year,
        name,
        email,
        url,
        paymentUrl,
        membership,
        slotDescriptions,
        update = false,
        virtual,
        owed,
        address,
        phoneNumber,
        room,
      } = v

      const formattedMembership = {
        ...membership,
        interestLevel: getInterestLevel(configuration, membership.interestLevel),
        attendance: getAttendance(configuration, membership.attendance),
        arrivalDate: formatDate(membership.arrivalDate),
        departureDate: formatDate(membership.departureDate),
        roomingPreferences: getRoomPref(membership.roomingPreferences),
      }

      return emailer.send({
        template: 'membershipConfirmation',
        message: {
          to: email,
          cc: emails.contactEmail,
        },
        locals: {
          update,
          name,
          email,
          year,
          url,
          paymentUrl,
          membership: formattedMembership,
          slotDescriptions,
          virtual,
          owed,
          address,
          phoneNumber,
          room,
          ...emails,
        },
      })
    })
    const promiseResults = await Promise.allSettled(emailResults)
    res.send({ promiseResults })
  } catch (err: any) {
    handleError(err, res)
  }
})
