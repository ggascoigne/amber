import Acnw, { Page } from 'components/Acnw'
import React from 'react'

export const Faq = () => (
  <Page>
    <h1>Frequently Asked Questions</h1>
    <h3 id='login'>Login</h3>
    <p>All of the login issues we've seen so far seem to fall into one of two categories.</p>

    <ol>
      <li> I was registered on the old site and my password doesn't work.</li>

      <li> I can't remember how I logged in last time.</li>
    </ol>

    <p>
      Both of these lead to people trying to get a password reset link sent to them and this is where we tend to run
      into problems.
    </p>

    <h3>TL;DR</h3>

    <p>If you asked for a password reset and didn't receive an email, then you aren't signed up like that.</p>

    <h3>Details</h3>
    <p>
      We can only send password reset emails for accounts that are handled by us (and by Auth0 behind the scenes). If
      you login with Google or Facebook, they own your credentials. In fact, they own them to the point that we don't
      know that they exist, we just know when they tell us that someone verified that they are who they said they are.
      What this means is if you logged in with Google or Facebook, we can't send a password reset email.
    </p>

    <p>
      Likewise if you haven't signed up for the site using the new system, we don't have any information about you and
      so won't send you a password reset email.
    </p>

    <p>
      For security reasons, we don't send any information to email addresses that aren't attached to accounts in the
      auth system. There really are good reasons for this, but I'll admit that it's not very user friendly.
    </p>

    <h4>So what can I do about it?</h4>

    <p>
      The key information that you need to know is what <strong>email address</strong> you used to register with{' '}
      <strong>this</strong> site. If you know that your Google or your Facebook account uses that same email address,
      then just login with them. It really doesn't matter which one that you use, they are just verifying an email
      address, and as as long as it's the right address, you're all set.
    </p>

    <p>If the addresses are not the same, then you probably want to sign up using that email address directly.</p>

    <p>
      Finally, if the address is out of date or you simply want to change it, then you should contact us at{' '}
      <Acnw.ContactEmail /> and we can help you sort it out.
    </p>
  </Page>
)
