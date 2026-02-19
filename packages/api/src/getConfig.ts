import { ssrHelpers } from '@amber/server/src/api/ssr'

import { JsonError } from './JsonError'
import type { Configuration } from './utils'
import { getSettingsObject } from './utils'

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

export const getConfig = async () => {
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

export const getDisplayScheduleFlag = async (): Promise<string> => {
  await loadSettings()
  return _flags?.display_schedule ?? 'No'
}
