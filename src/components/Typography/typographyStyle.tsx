import { Theme } from '@material-ui/core'
import { createStyles, makeStyles } from '@material-ui/core/styles'

export const useTypographyStyles = makeStyles((theme: Theme) =>
  createStyles({
    defaultFontStyle: {
      fontWeight: 300,
      lineHeight: '1.5em',
      fontSize: '14px',
    },
    defaultHeaderMargins: {
      marginTop: '20px',
      marginBottom: '10px',
    },
    quote: {
      padding: '10px 20px',
      margin: '0 0 20px',
      fontSize: '17.5px',
      borderLeft: '5px solid #eee',
    },
    quoteText: {
      margin: '0 0 10px',
      fontStyle: 'italic',
    },
    quoteAuthor: {
      display: 'block',
      fontSize: '80%',
      lineHeight: '1.42857143',
      color: '#777',
    },
    mutedText: {
      color: '#777',
    },
    primaryText: {
      color: theme.palette.primary.main,
    },
    infoText: {
      color: theme.palette.info.main,
    },
    successText: {
      color: theme.palette.success.main,
    },
    warningText: {
      color: theme.palette.warning.main,
    },
    dangerText: {
      color: theme.palette.error.main,
    },
    importantText: {
      color: theme.palette.error.main,
      fontVariant: 'small-caps',
      fontWeight: 500,
    },
    smallText: {
      fontSize: '65%',
      fontWeight: 400,
      lineHeight: '1',
      color: '#777',
    },
  })
)
