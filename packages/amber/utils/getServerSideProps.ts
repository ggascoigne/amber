import { dehydrate, QueryClient } from '@tanstack/react-query'
import { makeQueryRunner } from 'database/shared/queryRunner'

import { GetSettingsDocument } from '../client/graphql'

export async function configGetServerSideProps() {
  const { query, release } = await makeQueryRunner()
  const data = await query(GetSettingsDocument)
  release()

  const queryClient = new QueryClient()
  await queryClient.prefetchQuery(['getSettings'], () => data)

  return {
    props: {
      configData: data,
      dehydratedState: dehydrate(queryClient),
    },
  }
}
