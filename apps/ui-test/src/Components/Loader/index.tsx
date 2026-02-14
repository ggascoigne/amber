import { Fade, CircularProgress } from '@mui/material'

type LoadingSpinnerProps = {
  fade?: boolean
  delay?: string
}

export const LoadingSpinner = ({ fade = true, delay = '500ms' }: LoadingSpinnerProps) => (
  <Fade
    in={fade}
    style={{
      transitionDelay: delay,
    }}
    unmountOnExit
  >
    <div
      style={{
        zIndex: 1000,
        top: '50%',
        right: '50%',
        position: 'absolute',
      }}
    >
      <CircularProgress color='primary' />
    </div>
  </Fade>
)
