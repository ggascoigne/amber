import { Card } from '@mui/material'
import { Theme } from '@mui/material/styles'
import { ConfigDate, MDY } from 'amber/components'
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

const Hotel = () => {
  const { classes } = useStyles()
  const configuration = useConfiguration()
  return (
    <Page title='Embassy Suites Detroit-Livonia/Novi'>
      <Card className={classes.card} elevation={3}>
        <CardBody className={classes.cardBody}>
          <h3>Deadline dates this year</h3>
          <p>
            If you are trying to book your hotel room after{' '}
            <strong>
              <ConfigDate name='hotelBookingLastdate' format={MDY} />
            </strong>
            , please contact the organizers by e-mail at{' '}
            <a href={configuration.contactEmail}>{configuration.contactEmail}</a> before doing so.
          </p>

          <h3>tl;dr</h3>
          <p>
            The <em>Ambercon booking code</em> is <strong>{configuration.hotelBookingCode}</strong>.<br />
            The <em>Ambercon Direct Booking Link</em> is{' '}
            <strong>
              <a href={configuration.hotelBookingUrl}>{configuration.hotelBookingUrl}</a>
            </strong>
          </p>

          <h3>Details</h3>
          <p>We will once again be at the Embassy Suites Livonia.</p>
          <p>
            You can see a general layout of what the rooms are like on the Embassy Suites web page (for the moment, the
            hotel has a few pictures online that you can look at). Each room has a coffee machine (and they are very
            generous when you ask housekeeping for extra coffee/tea/sugar/etc.), a microwave, and a small fridge, along
            with a sink in the kitchenette area. In the living room there is a table with four chairs, a couch that
            converts to a pull-out bed, a lounge chair, a coffee table, end table and TV. There are hair dryers and a
            second TV in the bedroom, and those neat alarm clocks that will let you set two alarm times. Each room has
            voice mail, and high speed internet access is available for a fee.
          </p>

          <p>
            This particular Embassy Suites is nice in that it has a beautiful open atrium, with waterfalls, streams, and
            plants. There&apos;s also an indoor pool and an exercise room. With your room you also get a complimentary
            cooked-to-order breakfast (real food, not just bagels and donuts) and two free drinks each evening at the
            manager&apos;s reception.
          </p>

          <p>
            There is a restaurant in the hotel, and Embassy Suites is within short walking distance of one or two
            mid-priced restaurants. There is no fast food within short walking distance, however, so if you want cheap
            or quick food, we encourage you to bring food you can make in your room. If you have a car (or know someone
            who does) there is a Meijer&apos;s about one mile away, with a grocery in it, and lots of restaurants
            nearby. There will be a map of local establishments in the welcome area.
          </p>

          <h3>Booking and Convention Pricing</h3>
          <p>
            You can book online, either through the <a href='https://www.hilton.com'>Hilton main website</a>, the{' '}
            <a href='https://www.hilton.com/en/hotels/dttlies-embassy-suites-detroit-livonia-novi/'>
              Embassy Suites Livonia page
            </a>
            , or this{' '}
            <strong>
              <a href={configuration.hotelBookingUrl}>Direct Booking Link</a>
            </strong>
            , or make your reservations by app, phone, etcetera, if you prefer. If you book after{' '}
            {configuration.hotelBookingLastdate.setZone(configuration.baseTimeZone).toFormat('string')} please contact
            us by e-mail to <a href={configuration.contactEmail}>{configuration.contactEmail}</a>.
          </p>

          <p>
            If you book in another way, please use the <em>Ambercon Booking Code</em>. This will get you convention
            pricing and count your reservations against the convention reserved block of rooms that we need to fill. If
            you get other pricing that is cheaper, a) let us know so we can discuss this with the hotel and fix it, and
            b) do mention the Ambercon convention so we can still count your hotel room reservation.
            <br />
            The <em>Ambercon booking code</em> is <strong>{configuration.hotelBookingCode}</strong>).
          </p>

          <h3>Directions</h3>
          <p>
            <strong>Address:</strong>
            <br />
            19525 Victor Parkway, Livonia, MI 48152
            <br />
            Phone: (734) 462-6000, (800) EMBASSY
            <br />
            Fax: (734) 462-5873
            <br />
          </p>

          <p>
            Detroit Metro Airport is approximately 20 minutes south of the hotel. Here is a link to{' '}
            <a href='https://www.google.com/maps?q=19525+Victor+Parkway,+Livonia,+Michigan,+48152,+USA'>
              Google Maps for Directions
            </a>
          </p>

          <h3>Inquiries, Feedback, etcetera</h3>
          <p>
            Please send all hotel inquiries by e-mail to{' '}
            <a href={configuration.contactEmail}>{configuration.contactEmail}</a>.
          </p>

          <p>Thanks!</p>
        </CardBody>
      </Card>
    </Page>
  )
}

export default Hotel
