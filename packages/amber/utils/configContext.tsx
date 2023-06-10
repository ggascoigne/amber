import { createContext, useContext } from 'react'

import {
  Configuration as _Configuration,
  getSettingsObject as _getSettingsObject,
} from '@amber/api/src/utils/configuration'

export type Configuration = _Configuration
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
