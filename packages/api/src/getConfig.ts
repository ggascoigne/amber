import { ssrHelpers } from '@amber/server/src/api/ssr'

import { JsonError } from './JsonError'
import type { Configuration } from './utils'
import { getSettingsObject } from './utils'

let _conf: Configuration | undefined
export const getConfig = async () => {
  if (!_conf) {
    const data = await ssrHelpers.settings.getSettings.fetch()
    if (data) {
      _conf = getSettingsObject(data).config
    } else {
      throw new JsonError(400, `unable to load configuration`)
    }
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
