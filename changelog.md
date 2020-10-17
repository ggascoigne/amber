10/17/2020

* [x] Improve admin user filter - dynamically load list, differentiate between members and non-members.

10/16/2020

* [x] Clean up schedule display bugs - fix issues around games with no slot assigned.
* [x] Display schedule - what are you in and who else is in it.
* [x] display GM game preview - what are they running and who's in it

Older

* [x] automatically fill in 'no game' on incomplete choices.  This seems to be more in line with people's expectations.  
* [x] write FAQ on auth
* [x] Stop users from signing up for full games.
* [x] Add ability to mark games as being full
* [x] sort choices in the display.
* [x] fix game choice so it can't create duplicates
* [x] Year tile looks funky with the accordion - fix it :)
* [x] Add goto top button to game books in general.
* [x] duplicate confirm game choices button on menu
* [x] Make yellow check mark more visible
* [x] Disable 1st choice button in slots where the player is a GM
* [x] Add contact page
* [x] make menu subtext font a bit bolder - check on Simone's computer/ Windows
* [x] Add Admin edit mode to the game edit
* [x] Game selection is a bit slow. Should switch away from manipulating the data in the apollo cache, just can't work out how to update the right item and instead, use the query to update a local copy which we edit and display from, updating it when the query results change.  That way we can get a snappy screen update without worrying about the latency. - Fixed by sorting out the cache update functions.
* [x] make game signup work on mobile.
* [x] Game book no longer works if you aren't logged in
* [x] Preselect all of the games that folk are GMing
* [x] hook up dev builds using dev database
* [x] migrate from vc secrets to vc env
* [x] change slot times to include day so something like "Slot 1: Thu 11 am to 3 pm PST"
* [x] Make sure that the signup page is only available to members.
* [x] Add IsGm logic
* [x] there's still something icky about the past cons page, it really shouldn't be using the url as an input in so many places.  It feels like we're mixing input from the url with input from state and making it far too complex. But it works for now.
* [x] Cloning the ui changes the tab - forces the UI back to the membership page. Actually this was just cloning the become a GM page.
* [x] Get old site accessible to me somewhere
* [x] add first and last name to member download
* [x] all tables should have a two-step sort not a three step one
* [x] gm games table should have a default sort by slot
* [x] all tables should have visual indications that you can click to edit, link or mouse change
* [x] gm games table should not allow for grouping
* [x] Game book download links for game admins
* [x] fix gm names
* [x] Customise the auth0 emails
* [x] move builds over to production auth0
* [x] add past game selection to game form
* [x] add login button to main screen at least for mobile.
* [x] format auth0 emails
* [x] Hook up SES to auth0
