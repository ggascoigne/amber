import { vercel } from '@t3-oss/env-core/presets-zod'
import { createEnv } from '@t3-oss/env-nextjs'
import { z } from 'zod'

export const processEnv = (src = process.env) =>
  createEnv({
    extends: [vercel()],
    /**
     * Specify your server-side environment variables schema here. This way you can ensure the app
     * isn't built with invalid env vars.
     */
    server: {
      DB_ENV: z.enum(['acnw', 'acus']),
      DATABASE_URL: z.url(),
      ADMIN_DATABASE_URL: z.url(),
      NODE_ENV: z.enum(['development', 'test', 'production']).prefault('development'),

      AUTH0_DOMAIN: z.url(),
      AUTH0_CLIENT_ID: z.string(),
      AUTH0_CLIENT_SECRET: z.string(),
      AUTH0_SECRET: z.string(),
      APP_BASE_URL: z.string().optional(),

      MANAGEMENT_CLIENT_ID: z.string(),
      MANAGEMENT_CLIENT_SECRET: z.string(),

      DATABASE_SCHEMAS: z.string().optional(),
      DATABASE_SSL_CERT: z.string().optional(),

      SMTP_USERNAME: z.string(),
      SMTP_PASSWORD: z.string(),
      SMTP_HOST: z.string(),
      SMTP_PORT: z.string(),
      EMAIL_FROM_ADDRESS: z.string(),

      STRIPE_PUBLISHABLE_KEY: z.string(),
      STRIPE_SECRET_KEY: z.string(),
      STRIPE_WEBHOOK_SECRET: z.string(),
    },

    /**
     * Specify your client-side environment variables schema here. This way you can ensure the app
     * isn't built with invalid env vars. To expose them to the client, prefix them with
     * `NEXT_PUBLIC_`.
     */
    client: {
      NEXT_PUBLIC_PORT: z.string().optional(),
    },

    /**
     * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
     * middlewares) or client-side so we need to destruct manually.
     */
    runtimeEnv: {
      DB_ENV: src.DB_ENV,
      DATABASE_URL: src.DATABASE_URL,
      ADMIN_DATABASE_URL: src.ADMIN_DATABASE_URL,
      NODE_ENV: src.NODE_ENV,

      AUTH0_DOMAIN: src.AUTH0_DOMAIN,
      AUTH0_CLIENT_ID: src.AUTH0_CLIENT_ID,
      AUTH0_CLIENT_SECRET: src.AUTH0_CLIENT_SECRET,
      AUTH0_SECRET: src.AUTH0_SECRET,
      APP_BASE_URL: src.APP_BASE_URL,

      MANAGEMENT_CLIENT_ID: src.MANAGEMENT_CLIENT_ID,
      MANAGEMENT_CLIENT_SECRET: src.MANAGEMENT_CLIENT_SECRET,

      DATABASE_SCHEMAS: src.DATABASE_SCHEMAS,
      DATABASE_SSL_CERT: src.DATABASE_SSL_CERT,

      SMTP_USERNAME: src.SMTP_USERNAME,
      SMTP_PASSWORD: src.SMTP_PASSWORD,
      SMTP_HOST: src.SMTP_HOST,
      SMTP_PORT: src.SMTP_PORT,
      EMAIL_FROM_ADDRESS: src.EMAIL_FROM_ADDRESS,

      STRIPE_PUBLISHABLE_KEY: src.STRIPE_PUBLISHABLE_KEY,
      STRIPE_SECRET_KEY: src.STRIPE_SECRET_KEY,
      STRIPE_WEBHOOK_SECRET: src.STRIPE_WEBHOOK_SECRET,

      NEXT_PUBLIC_PORT: src.PORT,
    },
    /**
     * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially
     * useful for Docker builds.
     */
    skipValidation: !!src.SKIP_ENV_VALIDATION,
    /**
     * Makes it so that empty strings are treated as undefined. `SOME_VAR: z.string()` and
     * `SOME_VAR=''` will throw an error.
     */
    emptyStringAsUndefined: true,
  })

export type EnvType = ReturnType<typeof processEnv>
