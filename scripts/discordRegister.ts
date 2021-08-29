#!/usr/bin/env ts-node-script -r dotenv/config

import fetch from 'node-fetch'

import { discordApiEndpoint, discordToken } from '../api/_constants'
import { commands } from '../api/discord/_commands'

async function main() {
  const response = await fetch(discordApiEndpoint, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bot ${discordToken}`,
    },
    method: 'PUT',
    body: JSON.stringify(commands.map((c) => c.command)),
  })

  if (response.ok) {
    console.log('Registered all commands')
  } else {
    console.error('Error registering commands')
    const text = await response.text()
    console.error(text)
  }
}

main().then()
