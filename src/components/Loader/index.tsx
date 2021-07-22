import { Theme, WithStyles, createStyles, withStyles } from '@material-ui/core/styles'
import clsx from 'clsx'
import React from 'react'
import Spinner from 'react-spinkit'

const styles = (theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignContent: 'center',
      alignItems: 'center',
      flex: '1 0 auto',
    },
    tiny: {
      display: 'inline-block',
      paddingLeft: 8,
      marginTop: -3,
      marginBottom: -3,
      '& > .sk-chasing-dots': {
        height: 20,
        width: 20,
      },
    },
    progress: {
      margin: theme.spacing(2),
    },
  })

interface ILoader extends WithStyles<typeof styles> {
  error?: boolean
  retry?: (event: React.MouseEvent<HTMLElement>) => void
  timedOut?: boolean
  pastDelay?: boolean
  tiny?: boolean
}

const _Loader: React.FC<ILoader> = ({ classes, error, retry, timedOut, pastDelay, tiny = false }) => (
  <div className={clsx({ [classes.root]: !tiny, [classes.tiny]: tiny })}>
    {error && (
      <div>
        Error! <button onClick={retry}>Retry</button>
      </div>
    )}
    {timedOut && (
      <div>
        Taking a long time... <button onClick={retry}>Retry</button>
      </div>
    )}
    {pastDelay && <div>Loading...</div>}
    <Spinner fadeIn='half' className={clsx({ [classes.progress]: !tiny })} name='chasing-dots' color='#3f51b5' />
  </div>
)

export const Loader = withStyles(styles)(_Loader)
