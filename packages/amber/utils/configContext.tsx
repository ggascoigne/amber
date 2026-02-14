import { createContext, useContext } from 'react'

import type {
  Configuration as _Configuration,
  ConventionInfo as _ConventionInfo,
} from '@amber/api/src/utils/configuration'
import { getSettingsObject as _getSettingsObject } from '@amber/api/src/utils/configuration'

export type Configuration = _Configuration
export type ConventionInfo = _ConventionInfo
export const getSettingsObject = _getSettingsObject

export const configContext = createContext<Configuration | undefined>(undefined)

export const useConfiguration = () => {
  const config = useContext(configContext)
  if (!config) {
    throw new Error('useConfiguration must be used within a ConfigProvider, or config not loaded yet')
  }
  return config
}
export const ConfigProvider = configContext.Provider
