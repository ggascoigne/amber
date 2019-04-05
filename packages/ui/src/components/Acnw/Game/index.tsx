import { GetGames_games_edges_node } from '__generated__/GetGames'
import { WithStyles } from '@material-ui/core/styles'
import createStyles from '@material-ui/core/styles/createStyles'
import withStyles from '@material-ui/core/styles/withStyles'
import classNames from 'classnames'
import { LookupValue } from 'components/Acnw/Lookup'
import Card from 'components/MaterialKitReact/Card/Card'
import CardBody from 'components/MaterialKitReact/Card/CardBody'
import CardHeader from 'components/MaterialKitReact/Card/CardHeader'
import GridContainer from 'components/MaterialKitReact/Grid/GridContainer'
import GridItem from 'components/MaterialKitReact/Grid/GridItem'
import React from 'react'
import { Waypoint } from 'react-waypoint'
import maskEmail from 'utils/maskEmail'

const styles = createStyles({
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

const HeaderContent: React.FC<WithStyles<typeof styles> & { name: string; tiny: boolean }> = ({
  name,
  classes,
  tiny
}) => (
  <CardHeader color='info'>
    <h4 className={classNames({ [classes.tinyHeaderText]: tiny })}>{name}</h4>
  </CardHeader>
)

const Field: React.FC<WithStyles<typeof styles> & { label: string; small?: boolean; tiny: boolean }> = ({
  label,
  classes,
  children,
  small,
  tiny
}) => {
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

interface IGame extends WithStyles<typeof styles> {
  game: GetGames_games_edges_node
  year: number
  slot: { id: number }
  onEnter?: any
  tiny?: boolean
}

const _Game: React.FC<IGame> = ({ classes, game, year, slot, onEnter, tiny }) => {
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
        <Waypoint topOffset={100} bottomOffset={'80%'} onEnter={onEnter}>
          <div>
            <HeaderContent name={name} classes={classes} tiny={tiny} />
          </div>
        </Waypoint>
      ) : (
        <HeaderContent name={name} classes={classes} tiny={tiny} />
      )}
      <CardBody>
        <GridContainer className={classNames({ [classes.cardTiny]: tiny })}>
          <Field label={tiny ? 'GM' : 'Game Master'} classes={classes} tiny={tiny}>
            {gms.nodes.map(a => a.member.user.profile.fullName).join(', ')}
          </Field>
          <Field label={tiny ? 'Desc' : 'Description'} classes={classes} tiny={tiny}>
            <MultiLine text={description} />
          </Field>
          {setting && (
            <Field label={tiny ? 'Set' : 'Setting'} classes={classes} tiny={tiny}>
              <MultiLine text={setting} />
            </Field>
          )}
          {charInstructions && (
            <Field label={'Character & Player Instructions'} classes={classes} tiny={tiny}>
              <MultiLine text={charInstructions} />
            </Field>
          )}
          <Field label={'Genre/Type'} classes={classes} small tiny={tiny}>
            {genre} - {type}
          </Field>
          <Field label={'Teen Friendly'} classes={classes} small tiny={tiny}>
            {teenFriendly ? 'Yes' : 'No'}
          </Field>
          <Field label={'Number of Players'} classes={classes} small tiny={tiny}>
            {playerMin} - {playerMax}
          </Field>
          <Field label={'Player Preference'} classes={classes} small tiny={tiny}>
            <LookupValue realm={'gamePlayerPref'} code={playerPreference} />
          </Field>
          <Field label={''} classes={classes} tiny={tiny}>
            {playersContactGm
              ? `Players should contact the GM at '${maskEmail(gameContactEmail)}' prior to the convention.`
              : `Players need not contact the GM in advance of the convention.`}
          </Field>
        </GridContainer>
      </CardBody>
    </Card>
  ) : null
}

export const Game = withStyles(styles, { withTheme: true })(_Game)
