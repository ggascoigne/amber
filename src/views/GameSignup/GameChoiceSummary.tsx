import React from 'react'
import { useGetGameChoicesQuery } from '@/client'
import { Acnw } from '@/components'
import { GraphQLError } from '@/components/GraphQLError'
import { useGameUrl, useGetMemberShip, useUser } from '@/utils'

import { Field, MultiLine } from '@/components/CardUtils'
import { Loader } from '@/components/Loader'
import { Page } from '@/components/Page'
import { ChoiceSummary } from './SlotDetails'
import { Redirect } from '@/components/Navigation'

const GameChoiceSummary: React.FC = () => {
  const { year } = useGameUrl()
  const { userId } = useUser()
  const membership = useGetMemberShip(userId)

  const { error, data } = useGetGameChoicesQuery(
    {
      year,
      memberId: membership?.id ?? 0,
    },
    {
      enabled: !!membership,
    }
  )

  const gameChoices = data?.gameChoices?.nodes
  const gameSubmission = data?.gameSubmissions?.nodes

  if (membership === undefined) {
    // still loading
    return <Loader />
  }
  if (membership == null || !membership.attending) {
    // OK we know this is not a member
    return <Redirect to='/membership' />
  }

  if (error) {
    return <GraphQLError error={error} />
  }
  if (!data) {
    return <Loader />
  }

  if (!gameChoices?.length) {
    // i.e. an admin set the user and then refreshed the page to one with no records - boom
    return <Redirect to='/' />
  }

  return (
    <Page title='Game Selection Summary'>
      <h3>Summary of your Game Selections</h3>

      <ChoiceSummary year={year} gameChoices={gameChoices} />
      <br />
      {gameSubmission?.[0]?.message && (
        <Field label='Message'>
          <MultiLine text={gameSubmission[0].message} />
        </Field>
      )}
      <p>
        If you need to make changes to this schedule please email <Acnw.ContactEmail />
      </p>
    </Page>
  )
}

export default GameChoiceSummary
