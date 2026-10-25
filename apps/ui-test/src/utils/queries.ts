import type { output } from 'zod/mini'
import { useMutation, useQuery, keepPreviousData } from '@tanstack/react-query'
import { any, array, boolean, enum as zEnum, number, object, optional, string } from 'zod/mini'
import { createApiHandler } from '@/utils/api'

const requestSchema = object({
  pageIndex: number(),
  pageSize: number(),
  sorting: array(object({ id: string(), desc: boolean() })),
  globalFilter: string(),
  globalFilterCriteria: optional(string()),
  filters: optional(
    array(
      object({
        id: string(),
        value: any(),
        operator: optional(string()),
      }),
    ),
  ),
})

// ----------------------------------------------------------------------------
// /api/users

const userSchema = object({
  id: number(),
  firstName: string(),
  lastName: string(),
  fullName: string(),
  email: string(),
  address: string(),
  city: string(),
  state: string(),
  zipCode: string(),
  phone: string(),
  gender: zEnum(['male', 'female', 'non-binary']),
  subscriptionTier: zEnum(['free', 'basic', 'pro', 'enterprise']),
})

export type UserType = output<typeof userSchema>

// schema for the expected return data
const usersResponseSchema = object({
  rows: array(userSchema),
  rowCount: number(),
})

export type UsersResponseType = output<typeof usersResponseSchema>

export const getUsers = createApiHandler({
  method: 'GET',
  path: '/api/users',
  requestSchema,
  responseSchema: usersResponseSchema,
})

export const useUsersQuery = (queryOptions: output<typeof requestSchema>, options?: { enabled?: boolean }) => {
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
  requestSchema: object({}),
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

export const userRequestSchema = object({
  guid: string(),
})

export const getUser = createApiHandler({
  method: 'GET',
  path: '/api/users/:id',
  requestSchema: userRequestSchema,
  responseSchema: userResponseSchema,
})

export const useUserQuery = (queryOptions: output<typeof userRequestSchema>, options?: { enabled?: boolean }) => {
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
    mutationFn: (data: output<typeof userSchema>) => updateUser(data),
  })
