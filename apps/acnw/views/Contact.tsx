import { Card } from '@mui/material'
import { Theme } from '@mui/material/styles'
import { Link, useConfiguration } from 'amber'
import { ContactEmail } from 'amber/components'
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

const Contact = () => {
  const { classes } = useStyles()
  const configuration = useConfiguration()
  return (
    <Page title='Contact'>
      <Card className={classes.card} elevation={3}>
        <CardBody className={classes.cardBody}>
          <h3>Payments</h3>
          <p>
            Ideally, payments should be made by visiting our <Link href='/payment'>payment page</Link> and paying
            online.
          </p>
          <p>Alternatively, if you&apos;d prefer to pay by cheque, then payments should be made out to:</p>

          <h5 className={classes.address}>AmberCon NorthWest Inc</h5>

          <p>and sent to:</p>

          <h5 className={classes.address}>
            AmberCon NorthWest Inc
            <br />
            1914 SE 24th Ave
            <br />
            Portland OR 97214
          </h5>
          <p>
            If you need to contact the organizers, do so at <ContactEmail />.
          </p>
        </CardBody>
      </Card>
      <h3>Founder</h3>
      <p>
        Simone Cooper was also the founder and organizer of AmberCon UK, the first Amber Diceless Role Playing Game
        convention to take place outside of the US, and in fact outside of Detroit, the game&apos;s birthplace.
      </p>

      <p>
        After running the convention successfully for four years, Simone moved to Portland, Oregon in 1996, where she
        discovered McMenamins Edgefield, an AmberCon waiting to happen.
      </p>

      <p>
        Write in and say &ldquo;hi&rdquo; by emailing <ContactEmail />
      </p>

      <h3>Game Book Goddess</h3>
      <p>
        As a child Amber Cook looked up and saw the Zelazny books on her grandparent&apos;s bookshelf. Her father
        noticed and laughed, and said she was named after them. She couldn&apos;t wait to get old enough to read them.
        This was all fine until one day during her freshman year at college she decided to reread &lsquo;Nine
        Princes&rsquo; and happened to actually look at the publication date - which was two years after she was born.
        Very funny, Dad.
      </p>

      <p>Amber &lsquo;wrastles&rsquo; with the Game Schedule, and it usually wins.</p>

      <h3>Web, database & code monkey</h3>
      <p>
        If you have any suggestions for this web site, or if you run into any problems with it, please contact Guy at{' '}
        {configuration.webEmail}.
      </p>
    </Page>
  )
}

export default Contact
