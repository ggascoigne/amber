import React from 'react'
import { AuthConsumer } from '../components/Auth/authContext'
import Acnw from '../components/Acnw'
import { BannerImage } from '../components/Banner/BannerImage'
import Login from '../components/Login'
import Logout from '../components/Logout'

const Welcome = () => {
  return (
    <AuthConsumer>
      {({ authenticated, user }) => (
        <div>
          <BannerImage />
          <h1>Welcome!</h1>

          {authenticated ? (
            <>
              <Logout />
              <div>
                <h2>User Profile</h2>
                <ul>
                  <li>ID: {user.id}</li>
                  <li>Email: {user.email}</li>
                  <li>Role: {user.role}</li>
                </ul>
              </div>
            </>
          ) : (
            <Login />
          )}
          <p>
            Our <Acnw.Ordinal /> annual AmberCon Northwest is a fully scheduled role-playing game convention devoted to
            Roger Zelazny's worlds of Amber using Phage Press's Amber Diceless RPG by Erick Wujcik, and to diceless and
            indie RPGs of all kinds.
          </p>

          <p>
            You can use this site to learn about the convention and its venue, McMenamins Edgefield Bed and Breakfast
            Resort; register for the convention; submit your game events to the organizers; and sign up for games as
            they become available.
          </p>
          <br />

          <p>
            AmberCon NW announcements also appear on our{' '}
            <a href='https://www.facebook.com/groups/464742576942907/' target='_new'>
              Facebook group page
            </a>
            .
          </p>
          <br />

          <p>
            For information about other AmberCons in the US and abroad, go to{' '}
            <a href='http://www.ambercons.com' target='_new'>
              www.ambercons.com
            </a>
          </p>

          <h2>Deadline dates this year</h2>
          <ul>
            {/* search for Date Edit when changing */}
            <li>
              <span className='deadlineExpired'>
                Initial registration and deposits: <Acnw.RegistrationDeadline />, <Acnw.ConventionYear />
              </span>
            </li>
            <li>
              <span className='deadlineExpired'>
                Membership payment in full: <Acnw.PaymentDeadline />, <Acnw.ConventionYear />
              </span>
            </li>
            <li>
              <span className='deadlineExpired'>
                Games and Events due: <Acnw.GameSubmissionDeadline />, <Acnw.ConventionYear />
              </span>
            </li>
            {/* and on home/gameBookClosed.gsp */}
            <li>
              <span className='deadlineExpired'>
                Game Book preview to GMs: September 8 &amp; 9, <Acnw.ConventionYear />
              </span>
            </li>
            <li>
              <span className='deadlineExpired'>
                Game Books open for selections: September 13, <Acnw.ConventionYear />
              </span>
            </li>
            <li>
              <span className='deadlineExpired'>
                Game Selections due: September 18, <Acnw.ConventionYear />
              </span>
            </li>
            <li>
              <span className='deadlineExpired'>
                Last date for cancellation with full refund: September 18, <Acnw.ConventionYear />
              </span>
            </li>
            <li>
              <span className='deadlineExpired'>
                Schedule previews to GMs: September 24, <Acnw.ConventionYear />
              </span>
            </li>
            <li>
              <span className='deadlineExpired'>
                Schedules SENT to all players: September 26, <Acnw.ConventionYear />
              </span>
            </li>
            <li>
              <span className='deadline'>
                Orders for shirts: October 9, <Acnw.ConventionYear />
              </span>
            </li>
            {/* referenced in shirtOrder / _form.gsp */}
            <li>
              <span className='deadline'>
                Travel coordination information due: October 16, <Acnw.ConventionYear />
              </span>
            </li>
            <li>
              <span className='deadline'>
                Last date for cancellation with partial refund: October 20, <Acnw.ConventionYear />
              </span>
            </li>
            <li>
              <span className='deadline'>
                Wednesday dinner RSVP: October 23, <Acnw.ConventionYear />
              </span>
            </li>
          </ul>

          <p>
            If you are accessing this site after{' '}
            <strong>
              <Acnw.PaymentDeadline />
            </strong>
            , please contact the organizers by e-mail at <Acnw.SimoneEmail /> before registering.
          </p>
          <br />
        </div>
      )}
    </AuthConsumer>
  )
}

export default Welcome
