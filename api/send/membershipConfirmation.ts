import { Request, Response } from 'express'

import { checkJwt } from '../_checkJwt'
import { emails } from '../_constants'
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
  checkJwt,
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
      if (err instanceof JsonError) {
        res.status(err.status).send({
          status: err.status,
          error: err.message,
        })
      } else {
        res.status(err.status || 500).send({
          error: err.message,
        })
      }
    }
  },
])
