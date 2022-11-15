import React, { useEffect } from 'react'
import { Redirect } from 'react-router-dom'
import { useForceLogin, useGetSettingValue, useSettings } from 'utils'

import { useAuth } from '../components/Auth'
import { Loader } from '../components/Loader'
import { Page } from '../components/Page'

const VirtualDetails = () => {
  const forceLogin = useForceLogin()
  const { isAuthenticated, isInitializing } = useAuth()

  const discordUrl = useGetSettingValue('url.discord') ?? ''
  const wikiUrl = useGetSettingValue('url.wiki') ?? ''
  const [, getSettingTruth] = useSettings()

  useEffect(() => {
    const f = async () => forceLogin({ appState: { targetUrl: '/virtual-details' } })
    f().then()
  }, [forceLogin])

  const isVisible = getSettingTruth?.('display.virtual.details')

  if (isInitializing || !isAuthenticated) {
    return <Loader />
  }

  if (!isVisible) {
    return <Redirect to='/' />
  }

  return (
    <Page title='Amber Virtual'>
      <h1>Accessing the Virtual Convention</h1>

      <h3>AmberCon NW's Discord server</h3>

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
        Here is your link. You will land on the server's Welcome Page, where you will have to click to agree to ACNW and
        Discord's anti-harassment and use policies. Then you will put yourself "in line" for a volunteer.
      </p>

      <p>
        Please do not share the link with others: {discordUrl ? <a href={discordUrl}>{discordUrl}</a> : <Loader tiny />}
      </p>

      <p>
        If you’re new to Discord or would like a preview of how the Con’s server will look and work, please check out
        our wiki, which has a step by step guide to checking in for the Con and your games: &nbsp;
        {wikiUrl ? <a href={wikiUrl}>{wikiUrl}</a> : <Loader tiny />}
      </p>
    </Page>
  )
}

export default VirtualDetails
