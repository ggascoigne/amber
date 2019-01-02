import CircularProgress from '@material-ui/core/CircularProgress'
import { withStyles } from '@material-ui/core/styles'
import React from 'react'

const styles = theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    flex: '1 0 auto'
  },
  progress: {
    margin: theme.spacing.unit * 2
  }
})

const CircularIndeterminate = ({ classes, error, retry, timedOut, pastDelay }) => (
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
