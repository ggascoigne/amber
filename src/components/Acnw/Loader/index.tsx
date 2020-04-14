import CircularProgress from '@material-ui/core/CircularProgress'
import { Theme, WithStyles, createStyles, withStyles } from '@material-ui/core/styles'
import React from 'react'

const styles = (theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignContent: 'center',
      alignItems: 'center',
      flex: '1 0 auto'
    },
    progress: {
      margin: theme.spacing(2)
    }
  })

interface ILoader extends WithStyles<typeof styles> {
  error?: boolean
  retry?: (event: React.MouseEvent<HTMLElement>) => void
  timedOut?: boolean
  pastDelay?: boolean
}

const CircularIndeterminate: React.FC<ILoader> = ({ classes, error, retry, timedOut, pastDelay }) => (
  <div className={classes.root}>
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
    <CircularProgress className={classes.progress} />
  </div>
)

export const Loader = withStyles(styles)(CircularIndeterminate)
