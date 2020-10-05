import { Theme, makeStyles } from '@material-ui/core'
import createStyles from '@material-ui/core/styles/createStyles'
import { ToggleButton, ToggleButtonGroup } from '@material-ui/lab'
import classNames from 'classnames'
import { GameCardChild } from 'components/Acnw'
import React from 'react'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    spacer: {
      flex: '1 0 auto',
      display: 'flex',
      flexDirection: 'row',
    },
    container: {
      flex: '1 1 auto',
      display: 'flex',
      flexDirection: 'column',
      margin: '-3px 0',
    },
    row: {
      flex: '1 1 auto',
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'flex-end',
      alignItems: 'center',
      '&:last-of-type': {
        paddingTop: 3,
      },
    },
    label: {
      width: 60,
      textAlign: 'inherit',
      textTransform: 'inherit',
      // flex: 1,
    },
    returning: {
      textAlign: 'end',
      textTransform: 'inherit',
      // flex: 1,
    },
    button: {
      textTransform: 'inherit',
      color: 'white',
      padding: '5px 7px',
      borderColor: 'white',
      '& sup': {
        lineHeight: 0,
        display: 'inline-block',
        paddingBottom: 3,
      },
      '&:hover': {
        backgroundColor: 'rgba(102, 8, 22, .3)',
      },
      '&.Mui-selected': {
        color: 'white',
        backgroundColor: 'rgba(102, 8, 22, 1)',
        borderLeftColor: 'white',
        '&:hover': {
          backgroundColor: 'rgba(102, 8, 22, .6)',
        },
      },
    },
  })
)

export const GameChoiceSelector: React.FC<GameCardChild> = ({ year, slot, gameId }) => {
  const classes = useStyles()
  const [priority, setPriority] = React.useState<string | null>(null)
  const [returning, setReturning] = React.useState(false)

  const handlePriority = (event: React.MouseEvent<HTMLElement>, newPriority: string | null) => {
    setPriority(newPriority)
  }

  return (
    <>
      <div className={classes.spacer} />
      <div className={classes.container}>
        <div className={classes.row}>
          <div className={classes.label}>Choice</div>
          <ToggleButtonGroup
            size='small'
            value={priority}
            exclusive
            onChange={handlePriority}
            aria-label='game priority'
          >
            <ToggleButton className={classes.button} value='GM' aria-label='GM'>
              GM
            </ToggleButton>
            <ToggleButton className={classes.button} value='1st' aria-label='first'>
              1<sup>st</sup>
            </ToggleButton>
            <ToggleButton className={classes.button} value='2nd' aria-label='second'>
              2<sup>nd</sup>
            </ToggleButton>
            <ToggleButton className={classes.button} value='3rd' aria-label='third'>
              3<sup>rd</sup>
            </ToggleButton>
            <ToggleButton className={classes.button} value='4th' aria-label='fourth'>
              4<sup>th</sup>
            </ToggleButton>
          </ToggleButtonGroup>
        </div>
        <div className={classes.row}>
          <ToggleButton
            value={returning}
            selected={returning}
            onChange={() => {
              setReturning(!returning)
            }}
            className={classNames(classes.returning, classes.button)}
          >
            Returning Player
          </ToggleButton>
        </div>
      </div>
    </>
  )
}
