import React from 'react'

import { useTRPC } from '@amber/client'
import { Field, Loader, MultiLine, Page } from '@amber/ui'
import { useQuery } from '@tanstack/react-query'

import { ChoiceSummary } from './SlotDetails'

import { ContactEmail } from '../../components'
import { Redirect } from '../../components/Navigation'
import { TransportError } from '../../components/TransportError'
import { useGameUrl, useGetMemberShip, useUser } from '../../utils'

const GameChoiceSummary = () => {
  const trpc = useTRPC()
  const { year } = useGameUrl()
  const { userId } = useUser()
  const membership = useGetMemberShip(userId)

  const { error, data } = useQuery(
    trpc.gameChoices.getGameChoices.queryOptions(
      {
        year,
        memberId: membership?.id ?? 0,
      },
      {
        enabled: !!membership,
      },
    ),
  )

  const gameChoices = data?.gameChoices
  const gameSubmission = data?.gameSubmissions

  if (membership === undefined) {
    // still loading
    return <Loader />
  }
  if (membership == null || !membership.attending) {
    // OK we know this is not a member
    return <Redirect to='/membership' />
  }

  if (error) {
    return <TransportError error={error} />
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
