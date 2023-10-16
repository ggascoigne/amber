import React from 'react'

import { Field, GraphQLError, Loader, MultiLine, Page } from 'ui'

import { ChoiceSummary } from './SlotDetails'

import { useGraphQL, GetGameChoicesDocument } from '../../client'
import { ContactEmail } from '../../components'
import { Redirect } from '../../components/Navigation'
import { useGameUrl, useGetMemberShip, useUser } from '../../utils'

const GameChoiceSummary: React.FC = () => {
  const { year } = useGameUrl()
  const { userId } = useUser()
  const membership = useGetMemberShip(userId)

  const { error, data } = useGraphQL(
    GetGameChoicesDocument,
    {
      year,
      memberId: membership?.id ?? 0,
    },
    {
      enabled: !!membership,
    },
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
        If you need to make changes to this schedule please email <ContactEmail />
      </p>
    </Page>
  )
}

export default GameChoiceSummary
