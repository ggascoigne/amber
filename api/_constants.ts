import { configuration as _conf } from '../src/utils/configuration'

export const configuration = _conf

export const audience = 'https://amberconnw.org'
export const isDev = process.env.NODE_ENV !== 'production'

export const managementClientId = process.env.MANAGEMENT_CLIENT_ID
export const managementClientSecret = process.env.MANAGEMENT_CLIENT_SECRET
export const authDomain = process.env.REACT_APP_AUTH0_DOMAIN

export const discordClientId = process.env.DISCORD_CLIENT_ID
export const discordGuildId = process.env.DISCORD_GUILD_ID
export const discordToken = process.env.DISCORD_TOKEN
export const discordPublicKey = process.env.DISCORD_PUBLIC_KEY

export const discordApiEndpoint = `https://discord.com/api/v8/applications/${discordClientId}/guilds/${discordGuildId}/commands`

export const emails = {
  contactEmail: configuration.contactEmail,
  gameEmail: configuration.gameEmail,
}
