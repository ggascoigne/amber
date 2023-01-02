import { Button, Card, Theme, useTheme } from '@mui/material'
import { makeStyles } from 'tss-react/mui'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { CardBody } from 'ui'
import { IsLoggedIn, IsNotLoggedIn, IsNotMember, useAuth, useConfiguration, useProfile, useSetting } from 'amber'

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
  const { user } = useAuth()
  const verified = !!user?.email_verified

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
              <>
                <h4>New Authentication system.</h4>
                <p>
                  We have a new authentication system. If you had an account for a previous Ambercon, you can link back
                  to it by signing up again using the same email address as before and then confirming that email
                  address. If you are a GM, this will give you option of copying games forward.
                </p>
                {/*
                <p>
                  Please note, that you can also login with either Facebook or Google. The same email advice applies in
                  this case too.
                </p>
*/}
                <Button
                  variant='outlined'
                  color='primary'
                  size='large'
                  component={Link}
                  href={`/api/auth/login?returnTo=${router.asPath}`}
                >
                  Login / Sign Up
                </Button>
              </>
            ) : null}
          </IsNotLoggedIn>

          <IsLoggedIn>
            {verified ? (
              <p>
                If you are interested in attending {configuration.title} this year, please
                {/* eslint-disable-next-line @getify/proper-ternary/nested */}
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
            ) : (
              <>
                <p>
                  Your email is unverified, once you respond to the verification email you will be able to register for 
                  the convention. 
                  After you verify your email, you have to Sign Out and Sign In again.
                </p>
              </>
            )}
          </IsLoggedIn>
        </CardBody>
      </Card>
    </IsNotMember>
  )
}
