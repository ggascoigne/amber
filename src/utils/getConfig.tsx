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
  const [config, setConfig] = useState<Config | undefined>()

  const getConfig = useCallback(() => {
    fetch(`${window.location.origin}/api/getConfig`, {
      method: 'get',
      headers: {
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
        }
        return responseBody
      })
  }, [setConfig])

  return [config, getConfig] as const
}
