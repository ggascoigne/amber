import { InteractionResponseType, InteractionType, verifyKey } from 'discord-interactions'
import { Request, Response } from 'express'
import getRawBody from 'raw-body'

import { discordPublicKey } from './_constants'
import { getCommand } from './discord/_commands'

const handler = async (req: Request, res: Response) => {
  if (req.method === 'POST') {
    const signature = req.headers['x-signature-ed25519']
    const timestamp = req.headers['x-signature-timestamp']
    const rawBody = await getRawBody(req)

    if (!signature || typeof signature !== 'string' || !timestamp || typeof timestamp !== 'string') {
      console.error('Invalid Request')
      return res.status(401).send({ error: 'Malformed header' })
    }

    const isValidRequest = verifyKey(rawBody, signature, timestamp, discordPublicKey as string)

    if (!isValidRequest) {
      console.error('Invalid Request')
      return res.status(401).send({ error: 'Bad request signature' })
    }

    const message = req.body

    if (message.type === InteractionType.PING) {
      console.log('Handling Ping request')
      res.send({
        type: InteractionResponseType.PONG,
      })
    } else if (message.type === InteractionType.APPLICATION_COMMAND) {
      const command = getCommand(message.data.name)
      if (command) {
        command.response(message, res)
      } else {
        console.error('Unknown Command')
        res.status(400).send({ error: 'Unknown Type' })
      }
    } else {
      console.error('Unknown Type')
      res.status(400).send({ error: 'Unknown Type' })
    }
  }
}

export default handler
