import { Response } from 'express'

import { discordClientId } from '../_constants'
import { Command, Message } from './_types'

export interface DiscordCommand {
  command: Command
  response: (message: Message, res: Response) => void
}

export const SLAP_COMMAND: DiscordCommand = {
  command: {
    name: 'slap',
    description: 'Sometimes you gotta slap a person with a large trout',
    options: [
      {
        name: 'user',
        description: 'The user to slap',
        type: 6,
        required: true,
      },
    ],
  },
  response: (message: Message, res: Response) => {
    console.log(`message = ${JSON.stringify(message, null, 2)}`)
    res.status(200).send({
      type: 4,
      data: {
        content: `*<@${message.member?.user?.id}> slaps <@${message.data?.options?.[0].value}> around a bit with a large trout*`,
      },
    })
    console.log('Slap Request')
  },
}

export const INVITE_COMMAND: DiscordCommand = {
  command: {
    name: 'invite',
    description: 'Get an invite link to add the bot to your server',
  },
  response: (message: Message, res: Response) => {
    const INVITE_URL = `https://discord.com/oauth2/authorize?client_id=${discordClientId}&scope=applications.commands`
    console.log(`message = ${JSON.stringify(message, null, 2)}`)

    res.status(200).send({
      type: 4,
      data: {
        content: INVITE_URL,
        flags: 64,
      },
    })
    console.log('Invite request')
  },
}

export const SUPPORT_COMMAND: DiscordCommand = {
  command: {
    name: 'support',
    description: 'Like this bot? Support me!',
  },
  response: (message: Message, res: Response) => {
    console.log(`message = ${JSON.stringify(message, null, 2)}`)
    res.status(200).send({
      type: 4,
      data: {
        content:
          "Thanks for using my bot! Let me know what you think on twitter (@IanMitchel1). If you'd like to contribute to hosting costs, you can donate at https://github.com/sponsors/ianmitchell",
        flags: 64,
      },
    })
    console.log('Support request')
  },
}

export const commands = [SLAP_COMMAND, INVITE_COMMAND, SUPPORT_COMMAND]

export const getCommand = (name: string) => {
  const input = name.toLowerCase()
  return commands.find((c) => c.command.name === input)
}
