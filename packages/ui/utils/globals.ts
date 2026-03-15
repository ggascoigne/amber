type RuntimeProcessShape = {
  env?: {
    NODE_ENV?: string
  }
}

const runtimeGlobals = globalThis as typeof globalThis & {
  process?: RuntimeProcessShape
}

// note that @amber/ui does not depend on @amber/environment
export const isDev = runtimeGlobals.process?.env?.NODE_ENV === 'development'
