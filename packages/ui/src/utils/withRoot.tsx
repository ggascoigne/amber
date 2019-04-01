/*
import green from '@material-ui/core/colors/green'
import purple from '@material-ui/core/colors/purple'
*/
import CssBaseline from '@material-ui/core/CssBaseline'
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'
import React, { ReactElement } from 'react'

// A theme with custom primary and secondary color.
// It's optional.
const theme = createMuiTheme({
  typography: {
    useNextVariants: true
  } /*,
  palette: {
    primary: {
      light: purple[300],
      main: purple[500],
      dark: purple[700]
    },
    secondary: {
      light: green[300],
      main: green[500],
      dark: green[700]
    }
  }*/
})

function withRoot(Component: React.ComponentType) {
  function WithRoot(props: any): ReactElement {
    // MuiThemeProvider makes the theme available down the React tree
    // thanks to React context.
    return (
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        <Component {...props} />
      </MuiThemeProvider>
    )
  }

  return WithRoot
}

export default withRoot
