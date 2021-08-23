import { Response } from 'express'
import { DateTime } from 'luxon'

import { MembershipConfirmation } from '../../src/utils/apiTypes'
import { getAttendance, getInterestLevel, getRoomPref } from '../../src/utils/selectValues'
import { requireJwt } from '../_checkJwt'
import { emails } from '../_constants'
import { handleError } from '../_handleError'
import { JsonError } from '../_JsonError'
import { withApiHandler } from '../_standardHandler'
import { RequestOf, emailer } from './_email'

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

export default withApiHandler([
  requireJwt,
  async (req: RequestOf<MembershipConfirmation>, res: Response) => {
    try {
      if (!req.body)
        throw new JsonError(400, 'missing body: expecting year, name, email, url, membership, slotDescriptions')
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
      } = req.body
      if (!year) throw new JsonError(400, 'missing year')
      if (!name) throw new JsonError(400, 'missing name')
      if (!email) throw new JsonError(400, 'missing email')
      if (!url) throw new JsonError(400, 'missing url')
      if (!membership) throw new JsonError(400, 'missing membership')
      if (!slotDescriptions) throw new JsonError(400, 'missing slotDescriptions')
      if (virtual === undefined) throw new JsonError(400, 'missing virtual')

      const formattedMembership = {
        ...membership,
        interestLevel: getInterestLevel(membership.interestLevel),
        attendance: getAttendance(membership.attendance),
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
    } catch (err) {
      handleError(err, res)
    }
  },
])
