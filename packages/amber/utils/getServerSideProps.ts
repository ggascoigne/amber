import { ssrAuthenticatedHelpers } from '@amber/server/src/api/ssr'
import { auth0 } from '@amber/server/src/auth/auth0'
import debug from 'debug'
import type { GetServerSidePropsContext } from 'next'

import transformer from '../../server/src/utils/trpc-transformer'

const log = debug('amber:amber:getServerSideProps')

const oneHour = 60 * 60 * 1000
const tenMinutes = 10 * 60 * 1000

export async function configGetServerSideProps(context: GetServerSidePropsContext) {
  const startTime = Date.now()
  log('configGetServerSideProps started')

  // Get session from the request
  const session = await auth0.getSession(context.req)
  const userId = parseInt(session?.user?.userId, 10) || undefined
  const helper = ssrAuthenticatedHelpers(userId)

  const thisYear = new Date().getFullYear()

  const queryTasks: Array<{ label: string; promise: Promise<unknown> }> = []

  queryTasks.push({
    label: 'settings.getSettings',
    promise: helper.settings.getSettings.prefetch(undefined, { staleTime: oneHour }),
  })
  queryTasks.push({
    label: 'config.getConfig',
    promise: helper.config.getConfig.prefetch(undefined, { staleTime: oneHour }),
  })

  // If user is authenticated, prefetch user-specific data
  if (userId) {
    queryTasks.push({
      label: 'users.getUserAndProfile',
      promise: helper.users.getUserAndProfile.prefetch({ id: userId }, { staleTime: tenMinutes }),
    })
    queryTasks.push({
      label: 'memberships.getMembershipByYearAndId',
      promise: helper.memberships.getMembershipByYearAndId.prefetch(
        { year: thisYear, userId },
        { staleTime: tenMinutes },
      ),
    })
    queryTasks.push({
      label: 'gameAssignments.isGameMaster',
      promise: helper.gameAssignments.isGameMaster.prefetch({ userId, year: thisYear }, { staleTime: tenMinutes }),
    })
  }

  const settledResults = await Promise.allSettled(queryTasks.map((task) => task.promise))
  const failedPrefetches = settledResults
    .map((result, index) => ({ result, label: queryTasks[index]?.label ?? 'unknown' }))
    .filter(
      (settled): settled is { result: PromiseRejectedResult; label: string } => settled.result.status === 'rejected',
    )

  if (failedPrefetches.length > 0) {
    failedPrefetches.forEach(({ label, result }) => {
      console.error(`SSR prefetch "${label}" failed`, result.reason)
    })
    throw new AggregateError(
      failedPrefetches.map(({ result }) => result.reason),
      'configGetServerSideProps failed while prefetching queries',
    )
  }

  const trpcState = helper.dehydrate()

  if (log.enabled) {
    const decoded: any = transformer.deserialize(trpcState as any)

    log('getServerSideProps queries:', decoded?.queries?.length ?? 0)
    decoded?.queries?.forEach((q: any, index: number) => {
      log(`SSR Query ${index}:`, {
        queryKey: q.queryKey,
        status: q.state.status,
        dataUpdatedAt: new Date(q.state.dataUpdatedAt),
        hasData: !!q.state.data,
      })
    })
  }
  const endTime = Date.now()
  const duration = endTime - startTime
  log('configGetServerSideProps completed in %dms', duration)

  return {
    props: {
      trpcState,
    },
  }
}
