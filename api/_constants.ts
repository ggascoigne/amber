import { configuration as _conf } from '../src/utils/configuration'

export const configuration = _conf

export const audience = 'https://amberconnw.org'
export const isDev = process.env.NODE_ENV !== 'production'

export const managementClientId = process.env.MANAGEMENT_CLIENT_ID
export const managementClientSecret = process.env.MANAGEMENT_CLIENT_SECRET
export const authDomain = process.env.REACT_APP_AUTH0_DOMAIN

export const emails = {
  contactEmail: configuration.contactEmail,
  gameEmail: configuration.gameEmail,
}
