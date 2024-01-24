import React from 'react'

import { Button, Theme } from '@mui/material'
import { CutoffDateWarning, TimelineList } from 'amber/components'
import { BetaWarning } from 'amber/components/BetaWarning'
import { Link } from 'amber/components/Navigation'
import { IsMember } from 'amber/utils'
import { makeStyles } from 'tss-react/mui'
import { MdxWithExternalLinks, Page } from 'ui'

import { BecomeAMember } from './Memberships'

import { Banner } from '../components'
import WelcomeContent from '../content/WelcomeContent.mdx'

const useStyles = makeStyles()((theme: Theme) => ({
  banner: {
    textAlign: 'center',
  },
  deadline: {},
  deadlineExpired: {
    color: theme.palette.error.main,
    '&:after': {
      content: '" - date passed"',
    },
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: 24,
    paddingRight: 24,
  },
  title: {
    color: '#fff',
    fontWeight: 300,
    textTransform: 'none',
  },
}))

export const DynamicMemberContent = () => (
  <>
    <BecomeAMember />
    <IsMember>
      <Button variant='outlined' color='primary' size='large' href='/gm' component={Link} style={{ marginTop: 8 }}>
        Become a GM
      </Button>
    </IsMember>
  </>
)

export const Welcome: React.FC = () => {
  const { classes } = useStyles()
  const titleElement = (
    <>
      <div className={classes.banner}>
        <Banner />
      </div>
      <BetaWarning />
      <h1>Welcome!</h1>
    </>
  )
  return (
    <Page title='Welcome' titleElement={titleElement}>
      <MdxWithExternalLinks>
        <WelcomeContent />
      </MdxWithExternalLinks>
      <DynamicMemberContent />
      <CutoffDateWarning cutoffDateConfig='Membership Payment In Full Due' />
      <TimelineList ignoreBeforeDateConfig='Registration Open' />
    </Page>
  )
}
