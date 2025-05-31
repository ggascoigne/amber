import { ssrHelpers } from '@amber/server/src/api/ssr'

export async function configGetServerSideProps() {
  await ssrHelpers.settings.getSettings.prefetch()
  return {
    props: {
      trpcState: ssrHelpers.dehydrate(),
    },
  }
}
