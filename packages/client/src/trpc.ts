'use client'
import type { AppRouter } from '@amber/server/src/api/appRouter'
import type { UseQueryOptions } from '@tanstack/react-query'
import type { TRPCClientErrorLike } from '@trpc/client'
import { createTRPCContext, type TRPCQueryKey } from '@trpc/tanstack-react-query'

export const { TRPCProvider, useTRPC } = createTRPCContext<AppRouter>()

type BaseQueryOptions<T> = UseQueryOptions<any, TRPCClientErrorLike<any>, T, TRPCQueryKey>
export type QueryOptions<T> = Omit<BaseQueryOptions<T>, 'queryKey' | 'queryFn' | 'initialData'>
