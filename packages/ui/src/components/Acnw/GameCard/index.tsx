import { makeStyles } from '@material-ui/core'
import classNames from 'classnames'
import { GameFieldsFragment, GameGmsFragment } from 'client'
import { GridContainer, GridItem, LookupValue } from 'components/Acnw'
import Card from 'components/MaterialKitReact/Card/Card'
import CardBody from 'components/MaterialKitReact/Card/CardBody'
import CardHeader from 'components/MaterialKitReact/Card/CardHeader'
import React from 'react'
import { Waypoint } from 'react-waypoint'
import maskEmail from 'utils/maskEmail'

const useStyles = makeStyles({
  card: {
    marginBottom: 50
  },
  gridItem: {
    paddingBottom: 10
  },
  label: {
    fontWeight: 500,
    minWidth: 80
  },
  tinyCard: {
    height: 279,
    width: 295,
    zIndex: 10,
    transform: 'rotateZ(-3deg)'
  },
  tinyHeaderText: {
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis'
  },
  cardTiny: {
    overflow: 'hidden',
    height: 200
  }
})

const MultiLine: React.FC<{ text: string }> = ({ text }) => (
  <>
    {text.split('\n').map((i, key) => (
      <p key={key}>{i}</p>
    ))}
  </>
)

const HeaderContent: React.FC<{ name: string; tiny: boolean }> = ({ name, tiny }) => {
  const classes = useStyles()
  return (
    <CardHeader color='info'>
      <h4 className={classNames({ [classes.tinyHeaderText]: tiny })}>{name}</h4>
    </CardHeader>
  )
}

const Field: React.FC<{ label: string; small?: boolean; tiny: boolean }> = ({ label, children, small, tiny }) => {
  const classes = useStyles()
  return (
    <>
      <GridItem xs={12} sm={2} className={classNames(classes.gridItem, classes.label)}>
        {label}
      </GridItem>
      <GridItem xs={12} sm={small ? 4 : tiny ? 8 : 10} className={classes.gridItem}>
        {children}
      </GridItem>
    </>
  )
}

interface GameCard {
  game: GameFieldsFragment & GameGmsFragment
  year: number
  slot: { id: number }
  onEnter?: any
  tiny?: boolean
}

export const GameCard: React.FC<GameCard> = ({ game, year, slot, onEnter, tiny = false }) => {
  const classes = useStyles()
  const {
    id,
    name,
    slotId = 0,
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
    setting
  } = game

  return slotId ? (
    <Card
      key={`game_${id}`}
      className={classNames(classes.card, { [classes.tinyCard]: tiny })}
      id={`game/${year}/${slot.id}/${id}`}
    >
      {onEnter ? (
        <Waypoint topOffset={100} bottomOffset='80%' onEnter={onEnter}>
          <div>
            <HeaderContent name={name} tiny={tiny} />
          </div>
        </Waypoint>
      ) : (
        <HeaderContent name={name} tiny={tiny} />
      )}
      <CardBody>
        <GridContainer className={classNames({ [classes.cardTiny]: tiny })}>
          <Field label={tiny ? 'GM' : 'Game Master'} tiny={tiny}>
            {gms.nodes.map(a => a?.member?.user?.profile?.fullName).join(', ')}
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
    </Card>
  ) : null
}
