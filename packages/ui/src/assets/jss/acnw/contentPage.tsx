import { Theme } from '@material-ui/core/styles'
import createStyles from '@material-ui/core/styles/createStyles'

const contentPageStyles = (theme: Theme) =>
  createStyles({
    main: {
      background: '#FFFFFF',
      position: 'relative',
      zIndex: 3
    },
    mainRaised: {
      margin: '0px 20px 0px',
      borderRadius: '6px',
      boxShadow:
        '0 16px 24px 2px rgba(0, 0, 0, 0.14), 0 6px 30px 5px rgba(0, 0, 0, 0.12), 0 8px 10px -5px rgba(0, 0, 0, 0.2)',
      padding: theme.spacing.unit * 3
    }
  })

export default contentPageStyles
