import { getEmails, emailer, handleError, JsonError } from '@amber/api'
import { withApiAuthRequired } from '@auth0/nextjs-auth0'
import { GameChoiceConfirmationBody } from 'amber/utils/apiTypes'
import { NextApiRequest, NextApiResponse } from 'next'

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

export default withApiAuthRequired(async (req: NextApiRequest, res: NextApiResponse) => {
  const emails = await getEmails()
  try {
    if (!req.body) throw new JsonError(400, 'missing body: expecting year, name, email, url, game')
    const {
      year,
      name,
      email,
      url,
      gameChoiceDetails,
      message,
      update = false,
    } = req.body as GameChoiceConfirmationBody
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
      gameChoiceDetails[8],
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
  } catch (err: any) {
    handleError(err, res)
  }
})
