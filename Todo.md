#Todos & Ideas

* [ ] Add readme, contributing guide, etc.
* [ ] add tests, either unit or Cypress
* [ ] investigate https://www.w3.org/WAI/tutorials/tables/irregular/
* [ ] investigate https://github.com/JoviDeCroock/hoofd
* [ ] check out https://github.com/sindresorhus/type-fest

* [ ] Game book only shows in PST

* [ ]  Try to address folks signing up to ret-only games when they are not a returning player. 
    Let's put
    Returning players only
    Returning players 1st, then new players
    Accepting all players
    
    In the big blue title bar,  and/or we can emphasize it in the game description by making it the very first line, before the GM name.

* [ ] Generalize the forceLogin behavior - maybe push it up into SelectedContent
  
* [ ] Make menu/nav hierarchical
* [ ] upgrade from classnames to https://github.com/lukeed/clsx - it's smaller and faster
* [ ] investigate material-ui v5
  
* [ ] apparently hitting "Shift+Enter" in the "Game Choice Notes" box [in Google Chrome] does not start a new line, but instead submits the form. Maybe add a confirmation screen?)

* [ ] Add link to the Online verison of the AHP
  
* [*] add http://amberconnw.wikidot.com/ to links page
* [*] Add a members only Discord server link page
* [ ] Add T-Shirt art and sales link

* [ ] can open links such as edit game into another window
* [ ] dropdowns don't behave like native selects - you have to hit down arrow before you can select with the first character.
* [ ] Right now you can enter anything in the GM field for a game, I really need to lock that down to just allowing GM names, perhaps forcing the addition of the author.
* [ ] Restyle the choice interface - it's functional and very heavily based on the v1 site, I'm sure that we could do better.
* [ ] Look at displaying the game book stuff using react-window, try to avoid updated to off-screen pages.
* [ ] should refactor the color definitions scattered through the code to be centralized, maybe in the theme?
* [ ] Try to provide a way to get the schedule or game names off the schedule page - either allow better selection of export or something.
* [ ] Look at tagging other members in various fields, maybe use https://github.com/yairEO/tagify

the games table should:
* [ ] allow for bulk edit perhaps?
* [ ] split slots attending out into separate columns

* [ ] Make the year selector on the past cons page a bit smaller on mobile.
* [ ] get real auth keys for facebook and google-oauth link.
* [ ] Remove the lookups stuff - these should just be UI constants, they don't change, and it's too slow to retrieve them.
* [ ] In the past cons list, indicate which games the logged in user played.
* [ ] Convert the MaterialKitReact code to typescript - at least starting with the styles.  Remove all the bits that aren't being used.
* [ ] Extract dates from code and put them in the db.  The current behavior was inherited from v1 and was intended as a short term hack. 10 years later...
* [ ] rename hotel_room table to hotel_room_preference, and hotel_room_details to hotel_room, along with various related fields.
* [ ] refactor menu links based upon the composition examples at https://material-ui.com/guides/composition/#button
* [ ] A whole batch of weird quote characters got mangled transferring the data from mysql to postgres, probably caused by folks pasting in data from Word on the old site, and it not getting cleaned up correctly in the first place.  Either way it looks messy and should bet sanitized.
* [ ] Implement csv import so that we can do bulk operations such as assigning slots to games or players to games etc.  See the in-work code on the import_work branch.
* [ ] investigate https://www.graphile.org/postgraphile/usage-schema/ wrt. access postgraphile in the api layer
* [ ] Add site refresh behavior so that open browsers get a forced reload when the code changes
* [ ] Make sure email doesn't get sent to the usual recipients from the test environment
* [ ] Switch away from the ByNodeId functions in graphql and just standardize on the ById variants

## Done

See [changelog.md](changelog.md)

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

### Deadlines

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
