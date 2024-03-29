import { ReactNode } from 'react'

import { Box, Card } from '@mui/material'
import { Theme } from '@mui/material/styles'
import { useConfiguration } from 'amber/utils'
import { makeStyles } from 'tss-react/mui'
import { CardBody, Page } from 'ui'

const useStyles = makeStyles()((_theme: Theme) => ({
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
}))

type PersonType = {
  name: string
  title: string
  linkedIn?: string
  facebook?: string
  children: ReactNode
}

const Person: React.FC<PersonType> = ({ name, title, children, facebook, linkedIn }) => {
  const { classes } = useStyles()
  return (
    <Card className={classes.card}>
      <CardBody>
        <h4>
          {name}: ({title})
        </h4>
        <Box>{children}</Box>
        <Box sx={{ pt: 2 }}>
          Public Profile: <a href={linkedIn}>LinkedIn</a> | <a href={facebook}>FaceBook</a>
        </Box>
      </CardBody>
    </Card>
  )
}

const Contact = () => {
  const { classes } = useStyles()
  const configuration = useConfiguration()
  return (
    <Page title='Contact'>
      <Card className={classes.card} elevation={3}>
        <CardBody className={classes.cardBody}>
          <h3>Payments</h3>
          <p>Payments should be made out to:</p>

          <p>Details to come</p>
        </CardBody>
      </Card>

      <Person
        name='Joe Saul'
        title='Con Chair, Hotel Liaison'
        linkedIn='http://www.linkedin.com/in/josephmsaul'
        facebook='http://www.facebook.com/profile.php?id=599498658'
      >
        Joe edited Amberzine 7 and has been the president of the U-CON gaming convention.
      </Person>
      <Person
        name='Liz Trumitch'
        title='Treasurer'
        linkedIn='http://lnkd.in/uC2xXu'
        facebook='http://www.facebook.com/profile.php?id=504206423'
      >
        Liz was Co-chair of the tenth AmberCon US with Karen Moreno, and the chair of the next three, before running a
        fifth one with Kris Fazzari.
      </Person>
      <Person
        name='Christopher "Kit" Kindred'
        title='Gamebook'
        linkedIn='http://www.linkedin.com/pub/kit-kindred/2b/282/44'
        facebook='https://www.facebook.com/kitkindred'
      >
        Kit has been the Games Scheduler since 2011.
      </Person>
      <Person
        name='Edwin Voskamp'
        title='Programming, Player Scheduling'
        linkedIn='http://www.linkedin.com/in/edwinvoskamp'
        facebook='http://www.facebook.com/profile.php?id=1184095812'
      >
        Edwin is one half of Diceless by Design which holds the copyright to the Amber Diceless Role Playing Game, has
        been a vocal, hopefully constructive, critic of many aspects of various AmberCons. Thanks to a variety of Real
        World factors, he has been lucky, to attend dozens of AmberCon US, AmberCon North, AmberCon NorthWest, and
        AmberCon UK conventions.
      </Person>
      <Person
        name='Guy Gascoigne-Piggford'
        title='Website'
        linkedIn='https://www.linkedin.com/in/guy-gascoigne-piggford/'
        facebook='https://www.facebook.com/guy.piggford'
      >
        After years working on the AmberCon NW web site, Guy has adapted the site to support Ambercon US. If you have
        any suggestions for this web site, or if you run into any problems with it, please contact Guy at{' '}
        {configuration.webEmail}.
      </Person>
    </Page>
  )
}

export default Contact
