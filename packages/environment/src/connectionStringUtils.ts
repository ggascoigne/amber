type PostgresConnectionInfo = {
  user: string | undefined
  password: string | undefined
  host: string
  port: number
  database: string
  queryParams: Record<string, string>
}

export const parsePostgresConnectionString = (connectionString: string): PostgresConnectionInfo => {
  const [mainPart, queryString] = connectionString.split('?')

  const regex =
    /^postgres:\/\/(?:(?<user>[^:]+)(?::(?<password>[^@]*))?@)?(?<host>[^:/]+)(?::(?<port>\d+))?\/(?<database>.+)$/

  const match = regex.exec(mainPart!)

  // console.log('connectionStringUtils:', { connectionString, mainPart: `|${mainPart}|`, queryString, match })
  if (!match || !match.groups) {
    throw new Error(`Invalid connection string format: ${connectionString}`)
  }

  const queryParams: Record<string, string> = {}

  if (queryString) {
    queryString.split('&').forEach((param) => {
      const [key, value] = param.split('=')
      if (key) {
        queryParams[decodeURIComponent(key)] = decodeURIComponent(value ?? '')
      }
    })
  }

  return {
    user: match.groups.user === '' ? undefined : match.groups.user,
    password: match.groups.password === '' ? undefined : match.groups.password,
    host: match.groups.host!,
    port: match.groups.port ? parseInt(match.groups.port, 10) : 5432, // default Postgres port
    database: match.groups.database!,
    queryParams,
  }
}

export const recreatePostgresConnectionString = (info: PostgresConnectionInfo): string => {
  const userPart = info.user ? `${info.user}${info.password ? `:${info.password}` : ''}@` : ''
  const portPart = info.port === 5432 ? '' : `:${info.port}` // skip port if it's the default 5432
  const queryString = Object.entries(info.queryParams)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join('&')

  return `postgres://${userPart}${info.host}${portPart}/${info.database}${queryString ? `?${queryString}` : ''}`
}

export const safeConnectionString = (connectionString: string) => {
  const sections = parsePostgresConnectionString(connectionString)
  return recreatePostgresConnectionString({ ...sections, password: '*****' })
}
