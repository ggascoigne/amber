import { withApiAuthRequired } from '@auth0/nextjs-auth0'
import { MembershipConfirmationBody } from 'amber/utils/apiTypes'
import { getAttendance, getInterestLevel, getRoomPref } from 'amber/utils/selectValues'
import { DateTime } from 'luxon'
import { NextApiRequest, NextApiResponse } from 'next'

import { emailer } from './_email'

import { getConfig, getEmails } from '../_constants'
import { handleError } from '../_handleError'
import { JsonError } from '../_JsonError'

// /api/send/membershipConfirmation
// auth token: required
// body: {
//  year: number
//  name: string
//  email: string
//  url: string
//  membership: Membership
//  update?; boolean
// }

const formatDate = (date?: string) =>
  date ? DateTime.fromISO(date)?.toLocaleString(DateTime.DATE_MED_WITH_WEEKDAY) : ''

export default withApiAuthRequired(async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    if (!req.body)
      throw new JsonError(400, 'missing body: expecting year, name, email, url, membership, slotDescriptions')
    const configuration = await getConfig()
    if (!configuration) throw new JsonError(400, 'unable to load configuration')

    const emails = await getEmails()
    const {
      year,
      name,
      email,
      url,
      membership,
      slotDescriptions,
      update = false,
      virtual,
      owed,
      address,
      phoneNumber,
      room,
    } = req.body as MembershipConfirmationBody
    if (!year) throw new JsonError(400, 'missing year')
    if (!name) throw new JsonError(400, 'missing name')
    if (!email) throw new JsonError(400, 'missing email')
    if (!url) throw new JsonError(400, 'missing url')
    if (!membership) throw new JsonError(400, 'missing membership')
    if (!slotDescriptions) throw new JsonError(400, 'missing slotDescriptions')
    if (virtual === undefined) throw new JsonError(400, 'missing virtual')

    const formattedMembership = {
      ...membership,
      interestLevel: getInterestLevel(configuration, membership.interestLevel),
      attendance: getAttendance(configuration, membership.attendance),
      arrivalDate: formatDate(membership.arrivalDate),
      departureDate: formatDate(membership.departureDate),
      roomingPreferences: getRoomPref(membership.roomingPreferences),
    }

    const result = await emailer.send({
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
    res.send({ result })
  } catch (err: any) {
    handleError(err, res)
  }
})
