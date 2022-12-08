import { Button, Card, Theme, useTheme } from '@mui/material'
import { makeStyles } from 'tss-react/mui'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { configuration, IsNotMember, useSetting } from '@/utils'

import { IsLoggedIn, IsNotLoggedIn } from '@/components/Auth'
import { CardBody } from '@/components/Card'
import { useProfile } from '@/components/Profile'

const useStyles = makeStyles()((theme: Theme) => ({
  card: {
    paddingTop: 0,
  },
  button: {
    marginLeft: 10,
    [theme.breakpoints.down('md')]: {
      marginTop: 10,
    },
  },
}))

export const BecomeAMember = () => {
  const { classes } = useStyles()
  const theme = useTheme()
  const router = useRouter()
  const profile = useProfile()
  const allowed = useSetting('allow.registrations', true)

  return (
    <IsNotMember>
      <Card elevation={3}>
        <CardBody className={classes.card}>
          {configuration.virtual ? (
            <h2>
              Attending <span style={{ color: theme.palette.error.main }}>virtual</span> AmberCon NW
            </h2>
          ) : (
            <h2>Attending AmberCon NW</h2>
          )}
          <IsNotLoggedIn>
            <Button
              variant='outlined'
              color='primary'
              size='large'
              component={Link}
              href={`/api/auth/login?returnTo=${router.asPath}`}
            >
              Login / Sign Up
            </Button>
          </IsNotLoggedIn>

          <IsLoggedIn>
            <p>
              If you are interested in attending AmberCon NW this year, please
              {allowed ? (
                <Button
                  variant='outlined'
                  color='primary'
                  size='large'
                  className={classes.button}
                  disabled={!profile}
                  component={Link}
                  href='/membership/new'
                >
                  Register
                </Button>
              ) : (
                <span> check back as we'll be opening registration soon.</span>
              )}
            </p>
          </IsLoggedIn>
        </CardBody>
      </Card>
    </IsNotMember>
  )
}
