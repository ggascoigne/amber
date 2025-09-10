declare module '@prisma/nextjs-monorepo-workaround-plugin' {
  /**
   * PrismaPlugin is a Next.js Webpack plugin for Prisma monorepo support.
   * Usage: new PrismaPlugin()
   */
  export class PrismaPlugin {
    constructor(options?: Record<string, unknown>)
    apply(compiler: unknown): void
  }
}
