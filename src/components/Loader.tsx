import React from 'react'
import DotLoader from 'react-spinners/DotLoader'

import { Box } from '@mui/material'

interface ILoader {
  error?: boolean
  retry?: (event: React.MouseEvent<HTMLElement>) => void
  timedOut?: boolean
  pastDelay?: boolean
  tiny?: boolean
}

export const Loader: React.FC<ILoader> = ({ error, retry, timedOut, pastDelay, tiny = false }) => (
  <Box
    sx={[
      !tiny && {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center',
        flex: '1 0 auto',
      },
      tiny && {
        display: 'inline-block',
        paddingLeft: 1,
        marginTop: '-3px',
        marginBottom: '-3px',
        '& > .sk-chasing-dots': {
          height: '20px',
          width: '20px',
        },
      },
    ]}
  >
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
    <DotLoader
      color='#3f51b5'
      loading
      cssOverride={{ margin: '16px' }}
      size={32}
      aria-label='Loading Spinner'
      data-testid='loader'
    />
  </Box>
)
