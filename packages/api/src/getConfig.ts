import { ssrHelpers } from '@amber/server/src/api/ssr'
import type { Configuration } from '@amber/shared'
import { getSettingsObject } from '@amber/shared'

import { JsonError } from './JsonError'

let _conf: Configuration | undefined
let _flags: Record<string, string> | undefined

const loadSettings = async () => {
  if (!_conf) {
    const data = await ssrHelpers.settings.getSettings.fetch()
    if (data) {
      const settings = getSettingsObject(data)
      _conf = settings.config
      _flags = settings.flags
    } else {
      throw new JsonError(400, `unable to load configuration`)
    }
  }
}

const getConfig = async () => {
  await loadSettings()
  return _conf!
}

export const getEmails = async () => {
  const configuration = await getConfig()
  return {
    contactEmail: configuration?.contactEmail,
    gameEmail: configuration?.gameEmail,
  }
}
