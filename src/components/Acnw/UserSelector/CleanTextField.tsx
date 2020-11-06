import { TextField, withStyles } from '@material-ui/core'

export const CleanTextField = withStyles({
  root: {
    '& input': {
      paddingLeft: '5px !important',
    },
    '& label.Mui-focused': {
      color: 'inherit',
    },
    '& .MuiInput-underline:after, & .MuiInput-underline:before, & .MuiInput-underline:hover:not(.Mui-disabled):before': {
      borderBottomColor: 'inherit',
    },
  },
})(TextField)
