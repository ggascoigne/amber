import { useMutation, useQuery, keepPreviousData } from '@tanstack/react-query'
import { z } from 'zod'

import { createApiHandler } from '@/utils/api'

const requestSchema = z.object({
  pageIndex: z.number(),
  pageSize: z.number(),
  sorting: z.array(z.object({ id: z.string(), desc: z.boolean() })),
  globalFilter: z.string(),
  globalFilterCriteria: z.string().optional(),
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

// ----------------------------------------------------------------------------
// /api/users

const userSchema = z.object({
  id: z.number(),
  firstName: z.string(),
  lastName: z.string(),
  fullName: z.string(),
  email: z.string(),
  address: z.string(),
  city: z.string(),
  state: z.string(),
  zipCode: z.string(),
  phone: z.string(),
  gender: z.enum(['male', 'female', 'non-binary']),
  subscriptionTier: z.enum(['free', 'basic', 'pro', 'enterprise']),
})

export type UserType = z.infer<typeof userSchema>

// schema for the expected return data
const usersResponseSchema = z.object({
  rows: z.array(userSchema),
  rowCount: z.number(),
})

export type UsersResponseType = z.infer<typeof usersResponseSchema>

export const getUsers = createApiHandler({
  method: 'GET',
  path: '/api/users',
  requestSchema,
  responseSchema: usersResponseSchema,
})

export const useUsersQuery = (queryOptions: z.infer<typeof requestSchema>, options?: { enabled?: boolean }) => {
  const { enabled = true } = options ?? {}
  return useQuery({
    queryKey: ['usersData', queryOptions],
    queryFn: () => getUsers(queryOptions),
    placeholderData: keepPreviousData,
    enabled,
  })
}

export const getAllUsers = createApiHandler({
  method: 'GET',
  path: '/api/all-users',
  requestSchema: z.object({}),
  responseSchema: usersResponseSchema,
})

export const useAllUsersQuery = (options?: { enabled?: boolean }) => {
  const { enabled = true } = options ?? {}
  return useQuery({
    queryKey: ['all-usersData'],
    queryFn: () => getAllUsers({}),
    placeholderData: keepPreviousData,
    enabled,
  })
}

const userResponseSchema = userSchema

export const userRequestSchema = z.object({
  guid: z.string(),
})

export const getUser = createApiHandler({
  method: 'GET',
  path: '/api/users/:id',
  requestSchema: userRequestSchema,
  responseSchema: userResponseSchema,
})

export const useUserQuery = (queryOptions: z.infer<typeof userRequestSchema>, options?: { enabled?: boolean }) => {
  const { enabled = true } = options ?? {}
  return useQuery({
    queryKey: ['userData', queryOptions],
    queryFn: () => getUser(queryOptions),
    placeholderData: keepPreviousData,
    enabled,
  })
}

export const updateUser = createApiHandler({
  method: 'PUT',
  path: '/api/users/:id',
  requestSchema: userSchema,
  responseSchema: userSchema,
})

export const useUpdateUserMutation = () =>
  useMutation({
    mutationFn: (data: z.infer<typeof userSchema>) => updateUser(data),
  })
