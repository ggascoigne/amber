import { useGetGameChoicesQuery } from 'client'
import Acnw, { GraphQLError, Loader, Page } from 'components/Acnw'
import React from 'react'
import { Redirect } from 'react-router-dom'
import { useGameUrl, useGetMemberShip, useUser } from 'utils'

import { Field, MultiLine } from '../../components/Acnw/CardUtils'
import { ChoiceSummary } from './SlotDetails'

export const GameChoiceSummary: React.FC = () => {
  const { year } = useGameUrl()
  const { userId } = useUser()
  const membership = useGetMemberShip(userId)

  const { loading, error, data } = useGetGameChoicesQuery({
    variables: { year, memberId: membership?.id ?? 0 },
    skip: !membership,
    fetchPolicy: 'cache-and-network',
  })

  const gameChoices = data?.gameChoices?.nodes
  const gameSubmission = data?.gameSubmissions?.nodes

  if (membership === undefined) {
    // still loading
    return <Loader />
  } else if (membership == null) {
    // OK we know this is not a member
    return <Redirect to='/membership' />
  }

  if (error) {
    return <GraphQLError error={error} />
  }
  if (loading && !data) {
    return <Loader />
  }

  if (!gameChoices?.length) {
    // i.e. an admin set the user and then refreshed the page to one with no records - boom
    return <Redirect to='/' />
  }

  return (
    <Page>
      <h3>Summary of your Game Selections</h3>

      <ChoiceSummary year={year} gameChoices={gameChoices} />
      <br />
      {gameSubmission?.[0]?.message && (
        <Field label='Message'>
          <MultiLine text={gameSubmission?.[0]?.message} />
        </Field>
      )}
      <p>
        If you need to make changes to this schedule please email <Acnw.ContactEmail />
      </p>
    </Page>
  )
}
