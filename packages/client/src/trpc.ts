'use client'
import type { AppRouter } from '@amber/server/src/api/appRouter'
import { createTRPCContext } from '@trpc/tanstack-react-query'

export const { TRPCProvider, useTRPC } = createTRPCContext<AppRouter>()
