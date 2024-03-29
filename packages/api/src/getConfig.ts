import { GetSettingsDocument, GetSettingsQuery } from '@amber/client'
import { makeQueryRunner } from 'database/shared/postgraphileQueryRunner'

import { JsonError } from './JsonError'
import { Configuration, getSettingsObject } from './utils'

let _conf: Configuration | undefined

export const getConfig = async () => {
  if (!_conf) {
    const { query, release } = await makeQueryRunner()
    const { data, errors } = await query<GetSettingsQuery>(GetSettingsDocument)
    if (data) {
      _conf = getSettingsObject(data).config
    } else {
      throw new JsonError(400, `unable to load configuration: ${JSON.stringify(errors, null, 2)}`)
    }
    release()
  }
  return _conf
}

export const getEmails = async () => {
  const configuration = await getConfig()
  return {
    contactEmail: configuration?.contactEmail,
    gameEmail: configuration?.gameEmail,
  }
}
