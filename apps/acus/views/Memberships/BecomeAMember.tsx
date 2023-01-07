import { Button, Card, Theme, useTheme } from '@mui/material'
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
            <h2>Logging In to this {configuration.title} Site</h2>
          )}
          <IsNotLoggedIn>
            {!disableLogin ? (
              <>
                <p>
                  We have a new authentication system.{' '}
                  <strong>Your userid and password from before 2023 are gone</strong>. You have to{' '}
                  <strong>create a new userid and password</strong>. You can{' '}
                  <strong>re-create your userid with the same email address</strong>. For more information see our{' '}
                  <a href='/faq'>Frequently Asked Questions</a>.
                </p>
                <h4>Creating a Userid and Password</h4>
                <ol>
                  <li>Click on "LOGIN / SIGN UP"</li>
                  <li>On the white popup log in screen, click on the little blue link "Sign up" at the bottom</li>
                  <li>
                    Create your userid. <b>If you've used the Ambercon site since 2009, use the same email address</b>.
                    If you had an account for a previous Ambercon, you can link back to it by signing up again using the
                    same email address as before and then confirming that email address. If you are a GM, this will give
                    you option of copying games forward. If you don't know what email you used, please contact us at
                    <a href='mailto:signup@ambercon.com'>signup@ambercon.com</a>.
                  </li>
                  <li>Though it logs you in, nothing will work until your email address is verified.</li>
                  <li>
                    You will get a <strong>verification email</strong>
                  </li>
                  <li>Follow the instructions in the email (click on a link)</li>
                  <li>Sign out from the Ambercon website</li>
                  <li>Sign back in</li>
                </ol>
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
