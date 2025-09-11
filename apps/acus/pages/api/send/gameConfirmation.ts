import { GameConfirmationBody } from '@amber/amber/utils/apiTypes'
import { getPlayerPreference } from '@amber/amber/utils/selectValues'
import { getEmails, emailer, handleError, JsonError } from '@amber/api'
import { auth0 } from '@amber/server/src/auth/auth0'
import type { NextApiRequest, NextApiResponse } from 'next'

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

export default auth0.withApiAuthRequired(async (req: NextApiRequest, res: NextApiResponse) => {
  const emails = await getEmails()
  try {
    if (!req.body) throw new JsonError(400, 'missing body: expecting year, name, email, url, game')
    const { year, name, email, url, game, update = false } = req.body as GameConfirmationBody
    if (!year) throw new JsonError(400, 'missing year')
    if (!name) throw new JsonError(400, 'missing name')
    if (!email) throw new JsonError(400, 'missing email')
    if (!url) throw new JsonError(400, 'missing url')
    if (!game) throw new JsonError(400, 'missing game')

    game.playerPreference = getPlayerPreference(game.playerPreference)!
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
  } catch (err: any) {
    handleError(err, res)
  }
})
