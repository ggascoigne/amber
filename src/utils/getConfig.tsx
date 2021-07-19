import { useToken } from 'components/Auth'
import fetch from 'isomorphic-fetch'
import { useCallback, useState } from 'react'

export interface DbConfig {
  database: string
  user: string
  port: number
  host: string
  password: string
  ssl: boolean
  ssl_cert?: string
}

export interface Config {
  local: boolean
  databaseName: string
  database?: Partial<DbConfig>
}

export const useGetConfig = () => {
  const [jwtToken] = useToken()
  const [config, setConfig] = useState<Config | undefined>()

  const getConfig = useCallback(() => {
    fetch(window.location.origin + '/api/getConfig', {
      method: 'get',
      headers: jwtToken
        ? {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${jwtToken}`,
          }
        : {
            'Content-Type': 'application/json',
          },
    })
      .then((response) => response.text())
      .then((responseBody) => {
        try {
          const result = JSON.parse(responseBody)
          setConfig(result)
        } catch (e) {
          // console.log(e)
          return responseBody
        }
      })
  }, [setConfig, jwtToken])

  return [config, getConfig] as const
}
