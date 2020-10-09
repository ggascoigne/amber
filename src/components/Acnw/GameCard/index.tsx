import { Accordion, AccordionDetails, AccordionSummary, makeStyles } from '@material-ui/core'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import classNames from 'classnames'
import type { GameFieldsFragment, GameGmsFragment } from 'client'
import { GridContainer, LookupValue } from 'components/Acnw'
import Card from 'components/MaterialKitReact/Card/Card'
import CardBody from 'components/MaterialKitReact/Card/CardBody'
import React, { ReactNode } from 'react'
import { Waypoint } from 'react-waypoint'
import maskEmail from 'utils/maskEmail'

import { Field, HeaderContent, MultiLine } from '../CardUtils'
import { GameDecorator, GameDecoratorParams } from '../types'

const useStyles = makeStyles({
  card: {
    marginBottom: 50,
  },
  header: {
    display: 'f;ex',
    flex: 1,
  },
  tinyCard: {
    height: 279,
    width: 295,
    zIndex: 10,
    transform: 'rotateZ(-3deg)',
  },
  cardTiny: {
    overflow: 'hidden',
    height: 200,
  },
})

const GameCardDetails: React.FC<GameCard & { header: ReactNode }> = React.memo(
  ({ game, year, slot, onEnter, tiny, header }) => {
    const classes = useStyles()
    const {
      id,
      description,
      charInstructions,
      gameContactEmail,
      genre,
      playerMax,
      playerMin,
      playerPreference,
      playersContactGm,
      type,
      teenFriendly,
      gameAssignments: gms,
      setting,
    } = game

    return (
      <Card
        key={`game_${id}`}
        className={classNames(classes.card, { [classes.tinyCard]: tiny })}
        id={`game/${year}/${slot}/${id}`}
      >
        <Accordion defaultExpanded>
          <AccordionSummary
            expandIcon={tiny ? undefined : <ExpandMoreIcon />}
            id={`accordion-game/${year}/${slot}/${id}`}
          >
            {header}
          </AccordionSummary>
          <AccordionDetails>
            <CardBody>
              <GridContainer className={classNames({ [classes.cardTiny]: tiny })}>
                <Field label={tiny ? 'GM' : 'Game Master'} tiny={tiny}>
                  {gms.nodes.map((a) => a?.member?.user?.fullName).join(', ')}
                </Field>
                <Field label={tiny ? 'Desc' : 'Description'} tiny={tiny}>
                  <MultiLine text={description} />
                </Field>
                {setting && (
                  <Field label={tiny ? 'Set' : 'Setting'} tiny={tiny}>
                    <MultiLine text={setting} />
                  </Field>
                )}
                {charInstructions && (
                  <Field label='Character & Player Instructions' tiny={tiny}>
                    <MultiLine text={charInstructions} />
                  </Field>
                )}
                <Field label='Genre/Type' small tiny={tiny}>
                  {genre} - {type}
                </Field>
                <Field label='Teen Friendly' small tiny={tiny}>
                  {teenFriendly ? 'Yes' : 'No'}
                </Field>
                <Field label='Number of Players' small tiny={tiny}>
                  {playerMin} - {playerMax}
                </Field>
                <Field label='Player Preference' small tiny={tiny}>
                  <LookupValue realm='gamePlayerPref' code={playerPreference} />
                </Field>
                <Field label='' tiny={tiny}>
                  {playersContactGm
                    ? `Players should contact the GM at '${maskEmail(gameContactEmail)}' prior to the convention.`
                    : `Players need not contact the GM in advance of the convention.`}
                </Field>
              </GridContainer>
            </CardBody>
          </AccordionDetails>
        </Accordion>
      </Card>
    )
  }
)

export interface GameCardChild {
  year: number
  slot: number
  gameId: number
}

interface GameCard {
  game: GameFieldsFragment & GameGmsFragment
  year: number
  slot: number
  onEnter?: (param?: string) => void
  tiny?: boolean
  // these next two are required together
  decorator?: (props: GameDecorator) => React.ReactNode
  decoratorParams?: GameDecoratorParams
}

export const GameCard: React.FC<GameCard> = React.memo(
  ({ game, year, slot, onEnter, tiny = false, decorator, decoratorParams = {} }) => {
    const classes = useStyles()
    const { id, name, slotId = 0, description } = game

    const headerContent = (
      <div className={classes.header}>
        {decorator ? (
          <HeaderContent name={name} tiny={tiny}>
            {decorator({ year, slot, gameId: id, ...decoratorParams })}
          </HeaderContent>
        ) : (
          <HeaderContent name={name} tiny={tiny} />
        )}
      </div>
    )

    const header = onEnter ? (
      <Waypoint topOffset={100} bottomOffset='80%' onEnter={() => onEnter!(`${year}/${slot}/${game.id}`)}>
        {headerContent}
      </Waypoint>
    ) : (
      <>{headerContent}</>
    )

    if (game.year === 0) {
      return (
        <Card
          key={`game_${id}`}
          className={classNames(classes.card, { [classes.tinyCard]: tiny })}
          id={`game/${year}/${slot}/${id}`}
        >
          {header}
          <CardBody>
            <GridContainer className={classNames({ [classes.cardTiny]: tiny })}>
              <Field label={tiny ? 'Desc' : 'Description'} tiny={tiny}>
                <MultiLine text={name === 'No Game' ? "I'm taking this slot off" : description} />
              </Field>
            </GridContainer>
          </CardBody>
        </Card>
      )
    }

    return slotId ? <GameCardDetails game={game} year={year} slot={slot} tiny={tiny} header={header} /> : null
  }
)
