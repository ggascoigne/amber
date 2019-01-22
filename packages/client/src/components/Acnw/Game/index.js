import { withStyles } from '@material-ui/core'
import classNames from 'classnames'
import { Lookup } from 'components/Acnw/Lookup'
import Card from 'components/MaterialKitReact/Card/Card'
import CardBody from 'components/MaterialKitReact/Card/CardBody'
import CardHeader from 'components/MaterialKitReact/Card/CardHeader'
import GridContainer from 'components/MaterialKitReact/Grid/GridContainer'
import GridItem from 'components/MaterialKitReact/Grid/GridItem'
import React from 'react'
import Waypoint from 'react-waypoint'
import maskEmail from 'utils/maskEmail'

const styles = {
  card: {
    marginBottom: 50
  },
  gridItem: {
    paddingBottom: 10
  },
  label: {
    fontWeight: 500
  }
}

const MultiLine = ({ text }) => (
  <>
    {text.split('\n').map((i, key) => (
      <p key={key}>{i}</p>
    ))}
  </>
)

const Field = ({ label, classes, children, small }) => {
  return (
    <>
      <GridItem xs={12} sm={2} className={classNames(classes.gridItem, classes.label)}>
        {label}
      </GridItem>
      <GridItem xs={12} sm={small ? 4 : 10} className={classes.gridItem}>
        {children}
      </GridItem>
    </>
  )
}

const _Game = ({ classes, game, year, slot, onEnter }) => {
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

  const headerContent = (
    <CardHeader color='info'>
      <h4>{name}</h4>
    </CardHeader>
  )

  return slotId ? (
    <Card key={`game_${id}`} className={classes.card} id={`game/${year}/${slot.id}/${id}`}>
      {onEnter ? (
        <Waypoint topOffset={100} bottomOffset={'80%'} onEnter={onEnter}>
          <div>{headerContent}</div>
        </Waypoint>
      ) : (
        { headerContent }
      )}
      <CardBody>
        <GridContainer>
          <Field label={'Game Master'} classes={classes}>
            {gms.nodes.map(a => a.member.user.profile.fullName).join(', ')}
          </Field>
          <Field label={'Description'} classes={classes}>
            <MultiLine text={description} />
          </Field>
          {setting && (
            <Field label={'Setting'} classes={classes}>
              <MultiLine text={setting} />
            </Field>
          )}
          {charInstructions && (
            <Field label={'Character & Player Instructions'} classes={classes}>
              <MultiLine text={charInstructions} />
            </Field>
          )}
          <Field label={'Genre/Type'} classes={classes} small>
            {genre} - {type}
          </Field>
          <Field label={'Teen Friendly'} classes={classes} small>
            {teenFriendly ? 'Yes' : 'No'}
          </Field>
          <Field label={'Number of Players'} classes={classes} small>
            {playerMin} - {playerMax}
          </Field>
          <Field label={'Player Preference'} classes={classes} small>
            <Lookup realm={'gamePlayerPref'} code={playerPreference} />
          </Field>
          <Field label={''} classes={classes}>
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
