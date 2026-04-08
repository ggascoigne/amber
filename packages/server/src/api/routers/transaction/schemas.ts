import { z } from 'zod'

export const getTransactionsByYearInput = z.object({
  year: z.number(),
})

export const getTransactionsByUserInput = z.object({
  userId: z.number(),
})

export const getTransactionsByYearAndUserInput = z.object({
  year: z.number(),
  userId: z.number(),
})

export const getTransactionsByYearAndMemberInput = z.object({
  year: z.number(),
  memberId: z.number(),
})

export const transactionDataInput = z.object({
  userId: z.number(),
  memberId: z.number().optional(),
  amount: z.number(),
  origin: z.number(),
  stripe: z.boolean().optional(),
  timestamp: z.date().optional(),
  year: z.number(),
  notes: z.string().optional(),
  data: z.any(),
})

export const createTransactionInput = transactionDataInput

export const deleteTransactionInput = z.object({
  id: z.bigint(),
})

export const updateTransactionInput = z.object({
  id: z.bigint(),
  data: transactionDataInput.partial(),
})

export type GetTransactionsByYearInput = z.infer<typeof getTransactionsByYearInput>
export type GetTransactionsByUserInput = z.infer<typeof getTransactionsByUserInput>
export type GetTransactionsByYearAndUserInput = z.infer<typeof getTransactionsByYearAndUserInput>
export type GetTransactionsByYearAndMemberInput = z.infer<typeof getTransactionsByYearAndMemberInput>
export type CreateTransactionInput = z.infer<typeof createTransactionInput>
export type DeleteTransactionInput = z.infer<typeof deleteTransactionInput>
export type UpdateTransactionInput = z.infer<typeof updateTransactionInput>
