#Todos & Ideas

* Hook up SES to auth0
* format auth0 emails
* add login button to main screen at least for mobile.
* add past game selection to game form


* [ ] In the past cons list, indicate which games the logged in user played.
* [ ] Make the year selector on the past cons page a bit smaller on mobile.
* [ ] Convert the MaterialKitReact code to typescript - at least starting with the styles.  Remove all the bits that aren't being used.
* [ ] Extract dates from code and put them in the db.  The current behavior was inherited from v1 and was intended as a short term hack. 10 years later...

## Areas

### Auth0

* [x] move builds over to production auth0

### Site registration

Customise the auth0 emails

### Profiles

Allow for changing the email address. There is an api from auth0 for this, but it does no real validation. To be less error prone we should have a workflow like this:

   * user tries to change the email address
   * we send email to the new address with a validation code/link
   * user clicks on link
   * in response to that validation we update auth0 with the new email address, and update the database record.

see https://community.auth0.com/t/how-to-let-users-change-their-email-safely/41748 for a reference    

This is dependent upon:
  * [ ] being able to send email (AWS SES account is verified)
  * [ ] Generate and track unique codes
  * [ ] Associate some action with the code, for now that might be change email, but I can foresee more things fitting this pattern.

### Membership

Very minimal for ACNW-Virtual, just a record to tag games with.

### Game creation

Clean up the admin interface for game creation, make it look more like the acnw v1 interface wrt field layout.

Ensure that special behaviors, such as letting a user copy a previous year's game still work.

### Admin filtering

*  [ ] Provide mechanism to view site through the user's lens.
*  [ ] Allow user masquerading, let an admin update records as some other user.  Yes this sounds super sketchy, but it's far easier than using the api to do it and it *IS* authenticated after all.

### Content

Update ALL content for 2020


### General

* [ ] Move production builds over to https://amberconnw.org
* [x] add git hash to build

### Other

* [x] transition to main rds database
* [ ] get real auth keys for facebook and google-oauth link.
* [x] maybe add database name and or local vs aws flags, so it's easier to check in the ui
* [ ] rename hotel_room table to hotel_room_preference, and hotel_room_details to hotel_room, along with various related fields.
* [ ] there's still something icky about the past cons page, it really shouldn't be using the url as an input in so many places.  It feels like we're mixing input from the url with input from state and making it far too complex. But it works for now.
