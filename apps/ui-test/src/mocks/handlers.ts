import type { PGliteInterface } from '@electric-sql/pglite'
import debug from 'debug'
import { http, HttpResponse } from 'msw'
import { z } from 'zod'

import { setupUserDataPg } from './loaders'
import { getQueryParamsBySchema } from './utils'

import { fetchArrayData, fetchSingleItem, getDatabase as getPgliteDatabase } from '@/mocks/sqlTools'

declare global {
  interface Window {
    pglite: PGliteInterface
  }
}

const log = debug('handlers')

const publicUrl = (url: string) => `${process.env.NEXT_PUBLIC_BASE_URL ?? ''}${url}`

log('publicUrl', publicUrl('/api/users'))

// Initialize database lazily when first needed
let dbInitPromise: Promise<PGliteInterface> | null = null

const initializeDatabase = async (): Promise<PGliteInterface> => {
  dbInitPromise ??= (async () => {
    console.time(`Initializing database`)
    const db = await getPgliteDatabase()
    if (typeof window !== 'undefined') {
      window.pglite = db
    }
    try {
      await setupUserDataPg(db)
      console.log('handlers:', 'setup Postgres data complete')
    } catch (error) {
      console.log('handlers:', error)
    }
    console.timeEnd(`Initializing database`)
    // Signal that database is ready for Playwright tests
    if (typeof document !== 'undefined') {
      document.body.setAttribute('data-db-ready', 'true')
    }
    return db
  })()
  return dbInitPromise
}

const requestSchema = z.object({
  pageIndex: z.string().transform((val) => (val ? parseInt(val, 10) : 0)),
  pageSize: z.string().transform((val) => (val ? parseInt(val, 10) : 10)),
  sorting: z.array(
    z.object({
      id: z.string(),
      desc: z.string().transform((val) => val === 'true'),
    }),
  ),
  globalFilter: z.string().default(''),
  filters: z.optional(
    z.array(
      z.object({
        id: z.string(),
        value: z.any(),
        operator: z.optional(z.string()),
      }),
    ),
  ),
})

const handleError = (error: any) => {
  if (error?.message === 'PGlite error') {
    console.error(`PGlite error: '${error?.cause?.error}' executing:\n${error?.cause?.lastQuery}`)
  } else {
    console.error(error)
  }
  return HttpResponse.json(error.cause, { status: 500 })
}

export const handlers = [
  http.get(publicUrl('/api/users'), async ({ request }) => {
    try {
      const db = await initializeDatabase()
      const url = new URL(request.url)
      const { searchParams } = url
      const queryParams = getQueryParamsBySchema(searchParams, requestSchema)
      const { pageIndex, pageSize, sorting, globalFilter, filters } = queryParams

      // return res(ctx.status(500), ctx.body('internal server error'));
      const data = await fetchArrayData(
        db,
        {
          tableName: 'users',
          fts: false,
          globalFilterFields: ['firstName', 'lastName'],
        },
        {
          pageIndex,
          pageSize,
          sorting,
          globalFilter,
          filters,
        },
      )
      return HttpResponse.json(data, { status: 200 })
    } catch (error: any) {
      return handleError(error)
    }
  }),

  http.get(publicUrl('/api/all-users'), async () => {
    try {
      const db = await initializeDatabase()
      // return res(ctx.status(500), ctx.body('internal server error'));
      const data = await fetchArrayData(db, {
        tableName: 'users',
        fts: false,
        globalFilterFields: ['firstName', 'lastName'],
      })
      return HttpResponse.json(data, { status: 200 })
    } catch (error: any) {
      return handleError(error)
    }
  }),

  http.get(publicUrl('/api/users/:id'), async ({ request: _request, params }) => {
    try {
      const db = await initializeDatabase()
      const { id } = params
      const data = await fetchSingleItem(db, `SELECT * FROM users WHERE id = '${id}'`)
      return HttpResponse.json(data, { status: 200 })
    } catch (error: any) {
      return handleError(error)
    }
  }),

  http.put(publicUrl('/api/users/:id'), async ({ request, params }) => {
    try {
      const db = await initializeDatabase()
      const payload = (await request.json()) as Record<string, unknown>
      const id = Number(params.id ?? payload.id)
      const updatableColumns = [
        'firstName',
        'lastName',
        'fullName',
        'email',
        'address',
        'city',
        'state',
        'zipCode',
        'phone',
        'gender',
        'subscriptionTier',
      ]
      const updates = Object.fromEntries(
        Object.entries(payload).filter(([key]) => updatableColumns.includes(key)),
      ) as Record<string, unknown>
      const columns = Object.keys(updates)

      if (columns.length > 0) {
        const assignments = columns.map((column, index) => `"${column}" = $${index + 1}`).join(', ')
        const values = columns.map((column) => updates[column])
        await db.query(`UPDATE users SET ${assignments} WHERE id = $${columns.length + 1}`, [...values, id])
      }

      const data = await fetchSingleItem(db, `SELECT * FROM users WHERE id = '${id}'`)
      return HttpResponse.json(data, { status: 200 })
    } catch (error: any) {
      return handleError(error)
    }
  }),
]
