import superjson from 'superjson'

export const formatDebugValue = (...values: any) =>
  JSON.stringify(JSON.parse(superjson.stringify(values)).json, null, 2)
