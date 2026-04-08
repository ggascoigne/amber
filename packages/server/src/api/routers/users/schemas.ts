import { z } from 'zod'

const userFilterValueInput = z.union([z.string(), z.number(), z.boolean()])

export const userSortInput = z.array(
  z.object({
    id: z.string(),
    desc: z.boolean().optional(),
  }),
)

export const userColumnFilterInput = z.object({
  id: z.string(),
  value: userFilterValueInput.optional(),
})

export const userGlobalFilterInput = userFilterValueInput.optional().nullable()

export const userQueryPaginationInput = z.object({
  pageIndex: z.number().int().min(0),
  pageSize: z.number().int().min(1),
})

export const getUserByEmailInput = z.object({
  email: z.email(),
})

export const getUserByIdInput = z.object({
  id: z.number(),
})

export const getAllUsersAndProfilesWithQueryInput = z.object({
  sort: userSortInput.optional(),
  columnFilters: z.array(userColumnFilterInput).optional(),
  globalFilter: userGlobalFilterInput,
  pagination: userQueryPaginationInput.optional(),
})

export const getAllUsersByInput = z.object({
  query: z.string(),
})

export const updateUserDataInput = z.object({
  email: z.email().optional(),
  fullName: z.string().optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  displayName: z.string().optional(),
  balance: z.number().optional(),
})

export const updateUserInput = z.object({
  id: z.number(),
  data: updateUserDataInput,
})

export const createProfileInput = z.object({
  userId: z.number(),
  phoneNumber: z.string(),
  snailMailAddress: z.string(),
})

export const updateProfileDataInput = z.object({
  phoneNumber: z.string().optional(),
  snailMailAddress: z.string().optional(),
})

export const updateProfileInput = z.object({
  id: z.number(),
  data: updateProfileDataInput,
})

export type UserSortInput = z.infer<typeof userSortInput>
export type UserColumnFilter = z.infer<typeof userColumnFilterInput>
export type UserGlobalFilter = z.infer<typeof userGlobalFilterInput>
export type GetUserByEmailInput = z.infer<typeof getUserByEmailInput>
export type GetUserByIdInput = z.infer<typeof getUserByIdInput>
export type GetAllUsersAndProfilesWithQueryInput = z.infer<typeof getAllUsersAndProfilesWithQueryInput>
export type GetAllUsersByInput = z.infer<typeof getAllUsersByInput>
export type UpdateUserInput = z.infer<typeof updateUserInput>
export type CreateProfileInput = z.infer<typeof createProfileInput>
export type UpdateProfileInput = z.infer<typeof updateProfileInput>
