import { sendEmailInputSchema } from '../contracts/email'
import { sendEmail } from '../services/email'
import { createTRPCRouter, protectedProcedure } from '../trpc'

export const emailRouter = createTRPCRouter({
  send: protectedProcedure.input(sendEmailInputSchema).mutation(async ({ ctx, input }) => sendEmail(ctx, input)),
})
