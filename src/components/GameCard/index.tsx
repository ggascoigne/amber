import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { Accordion, AccordionDetails, AccordionSummary, Theme } from '@mui/material'
import type { GameEntry } from 'client'
import React, { ReactNode } from 'react'
import { InView } from 'react-intersection-observer'
import { makeStyles } from 'tss-react/mui'
import { isEveningSlot, isMorningSlot, maskEmail } from 'utils'

import { Card, CardBody } from '../Card'
import { Field, HeaderContent, MultiLine } from '../CardUtils'
import { GridContainer } from '../Grid'
import { LookupValue } from '../Lookup'
import { GameDecorator, GameDecoratorParams } from '../types'

const useStyles = makeStyles()((theme: Theme) => ({
  card: {
    marginBottom: 50,
  },
  cardBody: {
    [theme.breakpoints.down('md')]: {
      padding: 0,
    },
    [theme.breakpoints.up('sm')]: {
      padding: '0.9375rem 1.875rem',
    },
  },
  header: {
    display: 'flex',
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
  playerLine: {
    lineHeight: '1.5em',
  },
}))

const PlayerDetails: React.FC<{ player: Player }> = ({ player }) => {
  const { classes } = useStyles()
  return (
    <div className={classes.playerLine}>
      <span>{player.fullName}</span> (<span>{player.email}</span>)
    </div>
  )
}

type GameCardDetailsProps = GameCardProps & { header: ReactNode; gms?: Player[]; players?: Player[] }

const GameCardDetails: React.FC<GameCardDetailsProps> = React.memo(
  ({ game, year, slot, onEnter, tiny, header, players = [], gms = [] }) => {
    const { classes, cx } = useStyles()
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
      gameAssignments,
      setting,
      lateStart,
      lateFinish,
    } = game

    const content = (
      <CardBody className={classes.cardBody}>
        <GridContainer className={cx({ [classes.cardTiny]: tiny })}>
          <Field label={tiny ? 'GM' : 'Game Master'} tiny={tiny}>
            {gms.length
              ? gms.map((a) => <PlayerDetails key={a.fullName} player={a} />)
              : gameAssignments.nodes.map((a) => a?.member?.user?.fullName).join(', ')}
          </Field>
          {players.length ? (
            <Field label='Players' tiny={tiny}>
              {players.map((a) => (
                <PlayerDetails key={a.fullName} player={a} />
              ))}
            </Field>
          ) : null}
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
          {isMorningSlot(slot) && lateStart && lateStart !== 'Starts on time' && (
            <Field label='Late Start' small tiny={tiny}>
              <b>{lateStart}</b>
            </Field>
          )}
          {isEveningSlot(slot) && lateFinish && (
            <Field label='Late Finish' small tiny={tiny}>
              <b>Evening Game: Game may run late into the evening</b>
            </Field>
          )}
        </GridContainer>
      </CardBody>
    )
    return (
      <Card
        key={`game_${id}`}
        className={cx(classes.card, { [classes.tinyCard]: tiny })}
        id={`game/${year}/${slot}/${id}`}
      >
        {tiny ? (
          <>
            {header}
            {content}
          </>
        ) : (
          <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMoreIcon />} id={`accordion-game/${year}/${slot}/${id}`}>
              {header}
            </AccordionSummary>
            <AccordionDetails>{content}</AccordionDetails>
          </Accordion>
        )}
      </Card>
    )
  }
)

export interface GameCardChild {
  year: number
  slot: number
  gameId: number
}

interface Player {
  gm: number
  fullName: string
  email: string
}

interface GameCardProps {
  game: GameEntry
  year: number
  slot: number
  onEnter?: (param?: string) => void
  tiny?: boolean
  schedule?: boolean
  gms?: Player[]
  players?: Player[]
  // these next two are required together
  decorator?: (props: GameDecorator) => React.ReactNode
  decoratorParams?: GameDecoratorParams
}

export const GameCard: React.FC<GameCardProps> = React.memo(
  ({ game, year, slot, onEnter, tiny = false, decorator, decoratorParams = {}, schedule = false, gms, players }) => {
    const { classes, cx } = useStyles()
    const { id, name, slotId = 0, description } = game

    const headerText = schedule ? `${game.slotId!}: ${name}` : name

    const headerContent = (
      <>
        {decorator ? (
          <HeaderContent name={headerText} tiny={tiny}>
            {decorator({ year, slot, game, ...decoratorParams })}
          </HeaderContent>
        ) : (
          <HeaderContent name={headerText} tiny={tiny} />
        )}
      </>
    )

    const header = onEnter ? (
      <InView
        as='div'
        className={classes.header}
        rootMargin='-100px 0px -80% 0px'
        onChange={(inView) => inView && onEnter(`${year}/${slot}/${game.id}`)}
      >
        {headerContent}
      </InView>
    ) : (
      <>{headerContent}</>
    )

    if (game.year === 0) {
      const content = (
        <CardBody>
          <GridContainer className={cx({ [classes.cardTiny]: tiny })}>
            <Field label={tiny ? 'Desc' : 'Description'} tiny={tiny}>
              <MultiLine text={name === 'No Game' ? "I'm taking this slot off" : description} />
            </Field>
          </GridContainer>
        </CardBody>
      )
      return tiny ? (
        <Card
          key={`game_${id}`}
          className={cx(classes.card, { [classes.tinyCard]: tiny })}
          id={`game/${year}/${slot}/${id}`}
        >
          {header}
          {content}
        </Card>
      ) : (
        <Accordion defaultExpanded={!schedule} style={{ marginTop: 30 }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />} id={`accordion-game/${year}/${slot}/${id}`}>
            {header}
          </AccordionSummary>
          <AccordionDetails>{content}</AccordionDetails>
        </Accordion>
      )
    }

    return slotId ? (
      <GameCardDetails game={game} year={year} slot={slot} tiny={tiny} header={header} gms={gms} players={players} />
    ) : null
  }
)
