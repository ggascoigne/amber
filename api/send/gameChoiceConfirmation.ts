import { Response } from 'express'

import { GameChoiceConfirmation } from '../../src/utils/apiTypes'
import { requireJwt } from '../_checkJwt'
import { emails } from '../_constants'
import { handleError } from '../_handleError'
import { JsonError } from '../_JsonError'
import { withApiHandler } from '../_standardHandler'
import { RequestOf, emailer } from './_email'

// /api/send/gameChoiceConfirmation
// auth token: required
// body: {
//  update?: boolean
//  year: number
//  name: string
//  email: string
//  url: string
//  gameChoices: Game
// }

export default withApiHandler([
  requireJwt,
  async (req: RequestOf<GameChoiceConfirmation>, res: Response) => {
    try {
      if (!req.body) throw new JsonError(400, 'missing body: expecting year, name, email, url, game')
      const { year, name, email, url, gameChoiceDetails, message, update = false } = req.body
      if (!year) throw new JsonError(400, 'missing year')
      if (!name) throw new JsonError(400, 'missing name')
      if (!email) throw new JsonError(400, 'missing email')
      if (!gameChoiceDetails) throw new JsonError(400, 'missing gameChoices')

      const gameChoices = [
        gameChoiceDetails[1],
        gameChoiceDetails[2],
        gameChoiceDetails[3],
        gameChoiceDetails[4],
        gameChoiceDetails[5],
        gameChoiceDetails[6],
        gameChoiceDetails[7],
      ]

      const result = await emailer.send({
        template: 'gameChoiceConfirmation',
        message: update
          ? {
              to: emails.contactEmail,
            }
          : {
              to: email,
              cc: emails.contactEmail,
            },
        locals: {
          update,
          name,
          email,
          year,
          url,
          message,
          gameChoices,
          ...emails,
        },
      })
      res.send({ result })
    } catch (err) {
      handleError(err, res)
    }
  },
])
