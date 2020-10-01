#Todos & Ideas

* [x] fix gm names
* [x] Game book download links for game admins
* [ ] Add T-Shirt art and sales link
* [ ] Get old site accessible to me somewhere

* [ ] Make the year selector on the past cons page a bit smaller on mobile.
* [ ] there's still something icky about the past cons page, it really shouldn't be using the url as an input in so many places.  It feels like we're mixing input from the url with input from state and making it far too complex. But it works for now.
* [ ] get real auth keys for facebook and google-oauth link.
* [ ] migrate from vc secrets to vc env
* [ ] hook up dev builds using dev database
* [ ] Remove the lookups stuff - these should just be UI constants, they don't change, and it's too slow to retrieve them.
* [ ] In the past cons list, indicate which games the logged in user played.
* [ ] Convert the MaterialKitReact code to typescript - at least starting with the styles.  Remove all the bits that aren't being used.
* [ ] Extract dates from code and put them in the db.  The current behavior was inherited from v1 and was intended as a short term hack. 10 years later...
* [ ] rename hotel_room table to hotel_room_preference, and hotel_room_details to hotel_room, along with various related fields.

## Done

* [x] Hook up SES to auth0
* [x] format auth0 emails
* [x] add login button to main screen at least for mobile.
* [x] add past game selection to game form
* [x] move builds over to production auth0
* [x] Customise the auth0 emails

### Profiles

Allow for changing the email address. There is an api from auth0 for this, but it does no real validation. To be less error prone we should have a workflow like this:

   * user tries to change the email address
   * we send email to the new address with a validation code/link
   * user clicks on link
   * in response to that validation we update auth0 with the new email address, and update the database record.

see https://community.auth0.com/t/how-to-let-users-change-their-email-safely/41748 for a reference    

This is dependent upon:
  * [x] being able to send email (AWS SES account is verified)
  * [ ] Generate and track unique codes
  * [ ] Associate some action with the code, for now that might be change email, but I can foresee more things fitting this pattern.


* Initial registration: Sep 28, 2020
* Games and Events due: Sep 28, 2020
* Game Book preview to GMs: Oct 4, 2020
* Game Books open for selections: Oct 6, 2020
* Game Selections due: Oct 11, 2020
* Schedule previews to GMs: Oct 14, 2020
* Schedules SENT to all players: Oct 16, 2020

```
   September 2020
Su Mo Tu We Th Fr Sa
       1  2  3  4  5
 6  7  8  9 10 11 12
13 14 15 16 17 18 19
20 21 22 23 24 25 26
27 28 29 30            < -- 28

    October 2020
Su Mo Tu We Th Fr Sa
             1  2  3
 4  5  6  7  8  9 10  < -- 4, 6
11 12 13 14 15 16 17  < -- 11, 14, 16
18 19 20 21 22 23 24
25 26 27 28 29 30 31

   November 2020
Su Mo Tu We Th Fr Sa
 1  2  3  4  5  6  7  < -- 5
 8  9 10 11 12 13 14
15 16 17 18 19 20 21
22 23 24 25 26 27 28
29 30

```

add first and last name to member download
split slots attending out into separate columns

