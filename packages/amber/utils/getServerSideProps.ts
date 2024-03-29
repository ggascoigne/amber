import { dehydrate, QueryClient } from '@tanstack/react-query'
import { makeQueryRunner } from 'database/shared/postgraphileQueryRunner'

import { GetSettingsDocument } from '../client'

export async function configGetServerSideProps() {
  const { query, release } = await makeQueryRunner()
  const { data } = await query(GetSettingsDocument)
  release()

  const queryClient = new QueryClient()
  await queryClient.prefetchQuery({ queryKey: ['getSettings'], queryFn: () => data })

  return {
    props: {
      configData: data,
      dehydratedState: dehydrate(queryClient),
    },
  }
}
