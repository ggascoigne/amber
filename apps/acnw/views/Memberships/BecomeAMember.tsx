import { useTheme } from '@mui/material/styles'
import { Button, Card, Theme } from '@mui/material'
import { makeStyles } from 'tss-react/mui'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { CardBody } from 'ui'
import {
  IsLoggedIn,
  IsNotLoggedIn,
  IsNotMember,
  IsUnverified,
  IsVerifiedIncomplete,
  useConfiguration,
  useProfile,
  useSetting,
} from 'amber'

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
  const configuration = useConfiguration()
  const theme = useTheme()
  const router = useRouter()
  const profile = useProfile()
  const allowed = useSetting('allow.registrations', true)
  const disableLogin = useSetting('disable.login', false)

  return (
    <IsNotMember>
      <Card elevation={3}>
        <CardBody className={classes.card}>
          {configuration.virtual ? (
            <h2>
              Attending <span style={{ color: theme.palette.error.main }}>virtual</span> {configuration.title}
            </h2>
          ) : (
            <h2>Attending {configuration.title}</h2>
          )}
          <IsNotLoggedIn>
            {!disableLogin ? (
              <Button
                variant='outlined'
                color='primary'
                size='large'
                component={Link}
                href={`/api/auth/login?returnTo=${router.asPath}`}
              >
                Login / Sign Up
              </Button>
            ) : null}
          </IsNotLoggedIn>

          <IsUnverified>
            <p>
              Your email is unverified, once you respond to the verification email you will be able to register for the
              convention.
            </p>
            <p>After you verify your email, you have to Sign Out and Sign In again.</p>
          </IsUnverified>

          <IsVerifiedIncomplete>
            <p>Please Sign Out and Sign again to complete the registration process.</p>
          </IsVerifiedIncomplete>

          <IsLoggedIn>
            <p>
              If you are interested in attending {configuration.title} this year, please
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
