import { ssrHelpers } from '@amber/server/src/api/ssr'
import { auth0 } from '@amber/server/src/auth/auth0'
import debug from 'debug'
import type { GetServerSidePropsContext } from 'next'

import { ssrAuthenticatedHelpers } from '../../server/src/api/ssr'
import transformer from '../../server/src/utils/trpc-transformer'

const log = debug('amber:amber:getServerSideProps')

const oneHour = 60 * 60 * 1000
const tenMinutes = 10 * 60 * 1000

export async function configGetServerSideProps(context: GetServerSidePropsContext) {
  const startTime = Date.now()
  log('configGetServerSideProps started')

  // Get session from the request
  const session = await auth0.getSession(context.req)
  const userId = parseInt(session?.user?.userId, 10) || 0

  const helper = userId ? ssrAuthenticatedHelpers(userId) : ssrHelpers

  const thisYear = new Date().getFullYear()

  const queryPromises = []

  queryPromises.push(helper.settings.getSettings.prefetch(undefined, { staleTime: oneHour }))
  queryPromises.push(helper.config.getConfig.prefetch(undefined, { staleTime: oneHour }))

  // If user is authenticated, prefetch user-specific data
  if (userId) {
    queryPromises.push(helper.users.getUserAndProfile.prefetch({ id: userId }, { staleTime: tenMinutes }))
    queryPromises.push(
      helper.memberships.getMembershipByYearAndId.prefetch({ year: thisYear, userId }, { staleTime: tenMinutes }),
    )
    queryPromises.push(
      helper.gameAssignments.isGameMaster.prefetch({ userId, year: thisYear }, { staleTime: tenMinutes }),
    )
  }

  return Promise.all(queryPromises).then(() => {
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
    console.log('configGetServerSideProps completed in %dms', duration)

    return {
      props: {
        trpcState,
      },
    }
  })
}
