import { Request, Response } from 'express'

import { requireJwt } from '../_checkJwt'
import { emails } from '../_constants'
import { handleError } from '../_handleError'
import { JsonError } from '../_JsonError'
import { withApiHandler } from '../_standardHandler'
import { emailer } from './_email'

// /api/send/membershipConfirmation
// auth token: required
// body: {
//  year: number
//  name: string
//  email: string
//  url: string
//  membership: Membership
// }

export default withApiHandler([
  requireJwt,
  async (req: Request, res: Response) => {
    try {
      if (!req.body)
        throw new JsonError(400, 'missing body: expecting year, name, email, url, membership, slotDescriptions')
      const { year, name, email, url, membership, slotDescriptions } = req.body
      if (!year) throw new JsonError(400, 'missing year')
      if (!name) throw new JsonError(400, 'missing name')
      if (!email) throw new JsonError(400, 'missing email')
      if (!url) throw new JsonError(400, 'missing url')
      if (!membership) throw new JsonError(400, 'missing membership')
      if (!slotDescriptions) throw new JsonError(400, 'missing slotDescriptions')

      const result = await emailer.send({
        template: 'membershipConfirmation',
        message: {
          to: email,
          cc: emails.contactEmail,
        },
        locals: {
          name,
          email,
          year,
          url,
          membership,
          slotDescriptions,
          ...emails,
        },
      })
      res.send({ result })
    } catch (err) {
      handleError(err, res)
    }
  },
])
