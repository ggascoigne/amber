import React from 'react'

import { useAuth } from 'amber/components/Auth'
import { Redirect } from 'amber/components/Navigation'
import { useGetSettingValue, useFlag } from 'amber/utils'
import { Loader, Page } from 'ui'

const VirtualDetails = () => {
  const { user, isLoading } = useAuth()

  const discordUrl = useGetSettingValue('url.discord') ?? ''
  const wikiUrl = useGetSettingValue('url.wiki') ?? ''
  const isVisible = useFlag('display_virtual_details', false)

  if (isLoading || !user) {
    return <Loader />
  }

  if (!isVisible) {
    return <Redirect to='/' />
  }

  return (
    <Page title='Amber Virtual'>
      <h1>Accessing the Virtual Convention</h1>

      <h3>AmberCon NW&apos;s Discord server</h3>

      <p>
        Our virtual McMenamins Edgefield, is open. We would love all of the GMs and players to have signed in and gotten
        access to their individual game notice rooms as soon as possible. The sign in process does require a volunteer
        to check your identity against the member list and give you the permissions you need to access the space.
      </p>

      <p>
        Volunteers will be on hand off and on throughout the day starting at 9 a.m. Pacific time Saturday, 10/17, and
        during the week, responding to sign-in requests. Once you have been signed in, if you have further questions or
        need help with Discord or a tour of the server, you can contact a volunteer to set up a time.
      </p>

      <p>
        Here is your link. You will land on the server&apos;s Welcome Page, where you will have to click to agree to
        ACNW and Discord&apos;s anti-harassment and use policies. Then you will put yourself &ldquo;in line&rdquo; for a
        volunteer.
      </p>

      <p>
        Please do not share the link with others: {discordUrl ? <a href={discordUrl}>{discordUrl}</a> : <Loader tiny />}
      </p>

      <p>
        If you&apos;re new to Discord or would like a preview of how the Con&apos;s server will look and work, please
        check out our wiki, which has a step by step guide to checking in for the Con and your games: &nbsp;
        {wikiUrl ? <a href={wikiUrl}>{wikiUrl}</a> : <Loader tiny />}
      </p>
    </Page>
  )
}

export default VirtualDetails
