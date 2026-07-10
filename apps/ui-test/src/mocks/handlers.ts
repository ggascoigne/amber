import debug from 'debug'
import { http, HttpResponse } from 'msw'
import { z } from 'zod'

import { setupUserData } from './loaders'
import type { UserRecord } from './loaders/users'
import { getQueryParamsBySchema } from './utils'

import { fetchArrayData, fetchSingleItem, updateSingleItem } from '@/mocks/sqlTools'

const log = debug('handlers')

const publicUrl = (url: string) => `${process.env.NEXT_PUBLIC_BASE_URL ?? ''}${url}`

log('publicUrl', publicUrl('/api/users'))

// Initialize mock data lazily when first needed
let dataInitPromise: Promise<void> | null = null

const initializeData = async () => {
  dataInitPromise ??= (async () => {
    console.time(`Initializing mock data`)
    try {
      setupUserData()
      console.log('handlers:', 'setup in-memory data complete')
    } catch (error) {
      console.log('handlers:', error)
    }
    console.timeEnd(`Initializing mock data`)
    // Signal that mock data is ready for Playwright tests.
    if (typeof document !== 'undefined') {
      document.body.setAttribute('data-db-ready', 'true')
    }
  })()
  return dataInitPromise
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
  console.error(error)
  return HttpResponse.json(error.cause, { status: 500 })
}

export const handlers = [
  http.get(publicUrl('/api/users'), async ({ request }) => {
    try {
      await initializeData()
      const url = new URL(request.url)
      const { searchParams } = url
      const queryParams = getQueryParamsBySchema(searchParams, requestSchema)
      const { pageIndex, pageSize, sorting, globalFilter, filters } = queryParams

      // return res(ctx.status(500), ctx.body('internal server error'));
      const data = await fetchArrayData<UserRecord>(
        {
          tableName: 'users',
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
      await initializeData()
      // return res(ctx.status(500), ctx.body('internal server error'));
      const data = await fetchArrayData<UserRecord>({
        tableName: 'users',
        globalFilterFields: ['firstName', 'lastName'],
      })
      return HttpResponse.json(data, { status: 200 })
    } catch (error: any) {
      return handleError(error)
    }
  }),

  http.get(publicUrl('/api/users/:id'), async ({ request: _request, params }) => {
    try {
      await initializeData()
      const id = Number(params.id)
      const data = await fetchSingleItem<UserRecord>('users', id)
      return HttpResponse.json(data, { status: 200 })
    } catch (error: any) {
      return handleError(error)
    }
  }),

  http.put(publicUrl('/api/users/:id'), async ({ request, params }) => {
    try {
      await initializeData()
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

      await updateSingleItem<UserRecord>('users', id, updates)
      const data = await fetchSingleItem<UserRecord>('users', id)
      return HttpResponse.json(data, { status: 200 })
    } catch (error: any) {
      return handleError(error)
    }
  }),
]
