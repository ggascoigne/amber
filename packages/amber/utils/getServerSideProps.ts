import { ssrHelpers } from '@amber/server/src/api/ssr'

export async function configGetServerSideProps() {
  await ssrHelpers.settings.getSettings.prefetch()

  const ret = {
    props: {
      trpcState: ssrHelpers.dehydrate(),
    },
  }
  console.log('getServerSideProps:', ret)
  return ret
}
