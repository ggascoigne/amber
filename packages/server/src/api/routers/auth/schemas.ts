import { z } from 'zod'

export const getRolesInput = z.object({
  token: z.string().min(1),
})

export type GetRolesInput = z.infer<typeof getRolesInput>
