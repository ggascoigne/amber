import { ReactNode } from 'react'

import { useConfiguration } from '@amber/amber/utils'
import { CardBody, Page } from '@amber/ui'
import { Box, Card } from '@mui/material'

type PersonType = {
  name: string
  title: string
  linkedIn?: string
  facebook?: string
  children: ReactNode
}

const Person = ({ name, title, children, facebook, linkedIn }: PersonType) => (
  <Card sx={{ mt: '20px', mb: '20px' }}>
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

const Contact = () => {
  const configuration = useConfiguration()
  return (
    <Page title='Contact'>
      <Card sx={{ mt: '20px', mb: '20px' }} elevation={3}>
        <CardBody sx={{ pt: 0 }}>
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
