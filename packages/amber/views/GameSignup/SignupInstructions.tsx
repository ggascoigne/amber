import { Card, useTheme } from '@mui/material'
import React from 'react'
import { CardBody } from 'ui'
import { ConfigDate } from '../../components'
import { configuration } from '../../utils'

interface SignupInstructionsProps {
  year: number
}
export const SignupInstructions: React.FC<SignupInstructionsProps> = ({ year }) => {
  const theme = useTheme()

  return (
    <>
      <h2>Game Book - ACNW {year}</h2>

      {configuration.virtual ? (
        <>
          <h4>
            Instructions for Game Selections - <span style={{ color: theme.palette.error.main }}>virtual</span> AmberCon
            NW edition
          </h4>

          <p>
            We have a shortage of game spaces this year, plus a lot of small games. Follow the instructions below to
            give us as much flexibility as possible in assigning games. This is the best way to minimize your "no game"
            slot assignments.
          </p>

          <p>
            For each time slot you wish to attend and play games, please select at least a first, second, third and
            fourth choice game. Once you have selected "Any Game" or "No Game", you do not need to make further choices
            in that slot.
          </p>

          <p>
            There is a "messages" field on the confirmation page where you can indicate, if there are additional games
            or events you particularly do not mind being bumped into. This field can also be used to indicate any
            specific games you want to avoid in the event that your selected games are full; for example, you might not
            want to be accidentally assigned to the GM who runs your weekly campaign at home. Likewise let us know if
            you don't have a specific first-second-third order to your choices.
          </p>

          <Card elevation={3}>
            <CardBody>
              <p>
                Some games require technology, rules purchases, or subscriptions beyond AmberCon NW's Discord official
                server. Some may also extend in duration past the end of the official slot. Make sure you are willing
                and technologically able to meet any special requirements before choosing one of those games. Please be
                aware of this if you choose "any game" in a slot.
              </p>
            </CardBody>
          </Card>
        </>
      ) : (
        <>
          <h4>Instructions for Game Selections</h4>

          <p>Here's the opportunity to choose the games you want!</p>

          <p>
            Please select a first, second, third and fourth choice for each time slot you will be attending. We have a
            lot of small games and that means we might need those fourth choices this year. If you don't have a specific
            preference as to which is first, second, or third, please let us know: there is a "messages" field on the
            confirmation page for this purpose. This field can also be used to indicate any specific games you
            definitely want to avoid in the event all of your selected games are full; for example, you might not want
            to be accidentally assigned to the GM who runs your weekly campaign at home.
          </p>
        </>
      )}

      <h4>Game Selection</h4>
      <p>
        Make your selections on the "choice" section to the right of the games name, you'll see your choices reflected
        on the index pane on the left hand side. Returning players can indicate this by clicking the button in this
        section as well. Please note: you must select something in all four positions for each slot, though your last
        choice can always be "Any game." or "No game."
      </p>

      {!configuration.virtual && <p>Those attending Friday through Sunday can select events starting with Slot 4.</p>}

      <h4>Several things to note:</h4>

      <ol>
        {configuration.virtual ? (
          <>
            <li>
              Games will be filled on a first come, first served basis moderated so that everyone will have at least one
              first-choice game in their schedule. We will also try to distribute the "no game" slots fairly.
            </li>
            <li>
              If you have not registered for games by the end of the day, <ConfigDate name='gameChoicesDue' />, will be
              assigned games at random.
            </li>
            <li>
              If you are a returning player in a game, please click the "Returning Player" button in the choices section
              of the game title bar.
            </li>
          </>
        ) : (
          <>
            <li>
              Games will be filled on a first come, first served basis - moderated so that everyone will have at least
              one first-choice game in their schedule. Please register for games as soon as possible. There is a selfish
              reason and an organizer's reason for doing this. The selfish reason is so that you get into the games you
              want; the reason Simone cares is so she can get your registrations, make and confirm your schedules in
              time for you to communicate with your GMs before people start traveling on the week of the convention.
            </li>
            <li>
              If you have not registered for games by <ConfigDate name='gameChoicesDue' /> will be assigned games at
              random.
            </li>
            <li>
              In the Messages section, please let us know if you'll be arriving late for any particular game slot (for
              example, if your plane gets in late on Thursday or Friday), so we can pass this information on to your GM.
              Also let us know if you are planning to leave early on Sunday.
            </li>
            <li>
              If you are a returning player in a game, please let us know. Also, if you are signing up for a returning
              player game and are NOT a returning player, you may still get in, but to be safe please indicate a fourth
              choice game for that slot.
            </li>
          </>
        )}
        <li>
          If you are GMing a slot, you'll see that GM is pre-selected for your first choice game. You can then select a
          second, third, and fourth choice for that slot in the event that your game is cancelled.
        </li>
      </ol>
      <br />
    </>
  )
}
