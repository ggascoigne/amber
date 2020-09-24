import { Request, Response } from 'express'

import { getPlayerPreference } from '../../src/utils/lookupValues'
import { checkJwt } from '../_checkJwt'
import { emails } from '../_constants'
import { JsonError } from '../_JsonError'
import { withApiHandler } from '../_standardHandler'
import { emailer } from './_email'

// /api/send/gameConfirmation
// auth token: required
// body: {
//  year: number
//  name: string
//  email: string
//  url: string
//  game: Game
// }

export default withApiHandler([
  checkJwt,
  async (req: Request, res: Response) => {
    try {
      if (!req.body) throw new JsonError(400, 'missing body: expecting year, name, email, url, game')
      const { year, name, email, url, game } = req.body
      if (!year) throw new JsonError(400, 'missing year')
      if (!name) throw new JsonError(400, 'missing name')
      if (!email) throw new JsonError(400, 'missing email')
      if (!url) throw new JsonError(400, 'missing url')
      if (!game) throw new JsonError(400, 'missing game')

      game.playerPreference = getPlayerPreference(game.playerPreference)
      const result = await emailer.send({
        template: 'gameConfirmation',
        message: {
          to: email,
          cc: emails.gameEmail,
        },
        locals: {
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
