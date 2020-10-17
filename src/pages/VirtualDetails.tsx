import { Theme, makeStyles } from '@material-ui/core/styles'
import createStyles from '@material-ui/core/styles/createStyles'
import { Page } from 'components/Acnw'
import React from 'react'

import { useGetSettingValue } from '../utils'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    card: {
      marginTop: 20,
      marginBottom: 20,
    },
    cardBody: {
      paddingTop: 0,
    },
    address: {
      paddingLeft: 20,
    },
  })
)

export const VirtualDetails = () => {
  const discordUrl = useGetSettingValue('url.discord') ?? ''
  const wikiUrl = useGetSettingValue('url.wiki') ?? ''

  console.log({ discordUrl, wikiUrl })

  const classes = useStyles()
  return (
    <Page>
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
        Please do not share the link with others: <a href={discordUrl}>{discordUrl}</a>
      </p>

      <p>
        If you’re new to Discord or would like a preview of how the Con’s server will look and work, please check out
        our wiki, which has a step by step guide to checking in for the Con and your games:
        <a href={wikiUrl}>{wikiUrl}</a>
      </p>
    </Page>
  )
}
