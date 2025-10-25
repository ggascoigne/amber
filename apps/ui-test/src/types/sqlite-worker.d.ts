declare module 'sqlite-worker' {
  type SwQueryResults = any

  type SwQueryFn = (template: readonly string[], ...values: any) => Promise<SwQueryResults>

  interface SwTransaction extends SwQueryFn {
    commit: () => Promise<SwQueryResults>
  }

  type DB = {
    all: SwQueryFn
    get: SwQueryFn
    raw: any
    transaction: () => SwTransaction
    create_function: any
    close: () => void
    query: SwQueryFn
  }

  const SQLiteWorker: (options: {
    dist?: string
    name: string
    database?: any
    update?: any
    timeout?: number
  }) => Promise<DB>
}
