import { Request, Response } from 'express'

import { getPlayerPreference } from '../../src/utils/lookupValues'
import { requireJwt } from '../_checkJwt'
import { emails } from '../_constants'
import { handleError } from '../_handleError'
import { JsonError } from '../_JsonError'
import { withApiHandler } from '../_standardHandler'
import { emailer } from './_email'

// /api/send/gameConfirmation
// auth token: required
// body: {
//  update?: boolean
//  year: number
//  name: string
//  email: string
//  url: string
//  game: Game
// }

export default withApiHandler([
  requireJwt,
  async (req: Request, res: Response) => {
    try {
      if (!req.body) throw new JsonError(400, 'missing body: expecting year, name, email, url, game')
      const { year, name, email, url, game, update = false } = req.body
      if (!year) throw new JsonError(400, 'missing year')
      if (!name) throw new JsonError(400, 'missing name')
      if (!email) throw new JsonError(400, 'missing email')
      if (!url) throw new JsonError(400, 'missing url')
      if (!game) throw new JsonError(400, 'missing game')

      game.playerPreference = getPlayerPreference(game.playerPreference)
      const result = await emailer.send({
        template: 'gameConfirmation',
        message: update
          ? {
              to: emails.gameEmail,
            }
          : {
              to: email,
              cc: emails.gameEmail,
            },
        locals: {
          update,
          name,
          email,
          year,
          url,
          game,
          ...emails,
        },
      })
      res.send({ result })
    } catch (err) {
      handleError(err, res)
    }
  },
])
