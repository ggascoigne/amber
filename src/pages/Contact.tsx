import { Card } from '@material-ui/core'
import { Theme, makeStyles } from '@material-ui/core/styles'
import createStyles from '@material-ui/core/styles/createStyles'
import Acnw, { Page } from 'components/Acnw'
import React from 'react'

import CardBody from '../components/MaterialKitReact/Card/CardBody'
import { configuration } from '../utils'

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

const Contact = () => {
  const classes = useStyles()
  return (
    <Page>
      <h1>Contact</h1>
      <Card className={classes.card} elevation={3}>
        <CardBody className={classes.cardBody}>
          <h3>Payments</h3>
          <p>Payments should be made out to:</p>

          <h5 className={classes.address}>Simone Cooper</h5>

          <p>and sent to</p>

          <h5 className={classes.address}>
            AmberCon NW
            <br />
            c/o Simone Cooper
            <br />
            8047 N. Syracuse St.
            <br />
            Portland, OR 97203-4939
            <br />
          </h5>

          <p>
            If you should need to contact Simone, do so at <Acnw.ContactEmail />.
          </p>
        </CardBody>
      </Card>
      <h3>Organizer</h3>
      <p>
        Simone Cooper was also the founder and organizer of AmberCon UK, the first Amber Diceless Role Playing Game
        convention to take place outside of the US, and in fact outside of Detroit, the game's birthplace.
      </p>

      <p>
        After running the convention successfully for four years, Simone moved to Portland, Oregon in 1996, where she
        discovered McMenamins Edgefield, an AmberCon waiting to happen.
      </p>

      <p>
        Write in and say "hi" by emailing <Acnw.ContactEmail />
      </p>

      <h3>Game Book Goddess</h3>
      <p>
        As a child Amber Cook looked up and saw the Zelazny books on her grandparent's bookshelf. Her father noticed and
        laughed, and said she was named after them. She couldn't wait to get old enough to read them. This was all fine
        until one day during her freshman year at college she decided to reread 'Nine Princes' and happened to actually
        look at the publication date - which was two years after she was born. Very funny, Dad.
      </p>

      <p>Amber 'wrastles' with the Game Schedule, and it usually wins.</p>

      <h3>Web, database & code monkey</h3>
      <p>
        If you have any suggestions for this web site, or if you run into any problems with it, please contact Guy at{' '}
        {configuration.webEmail}.
      </p>
    </Page>
  )
}

export default Contact
