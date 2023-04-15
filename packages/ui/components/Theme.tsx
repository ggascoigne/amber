import { cyan, green, indigo, orange, purple, red } from '@mui/material/colors'
import { createTheme } from '@mui/material/styles'
import hexRgb from 'hex-rgb'

const primaryColor = indigo[500]
const secondaryColor = purple[500]
const dangerColor = red[500]
const warningColor = orange[500]
const infoColor = cyan[600]
const successColor = green[500]

const fontFamily = ['Roboto', 'Helvetica', 'Arial', 'sans-serif'].join(',')
const buildGradientShadow = (color: string) => {
  const point28 = hexRgb(color, {
    format: 'css',
    alpha: 0.28,
  })
  const point2 = hexRgb(color, {
    format: 'css',
    alpha: 0.2,
  })
  return `0 12px 20px -10px ${point28}, 0 4px 20px 0px rgba(0, 0, 0, 0.12), 0 7px 8px -5px ${point2}`
}

export const theme = createTheme({
  typography: {
    fontFamily,
    fontSize: 12.5, // 14 looks too chunky

    body2: {
      fontWeight: 400,
    },
  },
  components: {
    MuiTextField: {
      defaultProps: {
        variant: 'filled',
        size: 'small',
      },
    },
    MuiCssBaseline: {
      styleOverrides: {
        html: {
          boxSizing: 'border-box',
          WebkitFontSmoothing: 'antialiased',
          MozOsxFontSmoothing: 'grayscale',
          fontFamily: 'sans-serif',
          lineHeight: 1.15,
          WebkitTextSizeAdjust: '100%',
          MsTextSizeAdjust: '100%',
          MsOverflowStyle: 'scrollbar',
          WebkitTapHighlightColor: 'transparent',
        },
        '*, *::before, *::after': {
          boxSizing: 'inherit',
        },
        'strong, b': {
          fontWeight: 700,
        },
        body: {
          color: 'rgba(0, 0, 0, 0.87)',
          margin: 0,
          fontSize: '0.78125rem',
          fontFamily,
          fontWeight: 400,
          lineHeight: 1.43,
          letterSpacing: '0.01071em',
          backgroundColor: '#fafafa',
          textAlign: 'left',
        },
        '@media print': {
          body: {
            backgroundColor: '#fff',
          },
        },
        'body::backdrop': {
          backgroundColor: '#fafafa',
        },
        p: {
          fontSize: 14,
          margin: '0 0 10px',
        },
        'html *': {
          WebkitFontSmoothing: 'antialiased',
        },
        h1: {
          fontSize: '3.3125rem',
          lineHeight: '1.15em',
          fontWeight: 300,
          color: 'inherit',
          marginTop: 20,
          marginBottom: 10,
        },
        h2: {
          fontSize: '2.25rem',
          lineHeight: '1.5em',
          fontWeight: 300,
          color: 'inherit',
          marginTop: 20,
          marginBottom: 10,
        },
        h3: {
          fontSize: '1.5625rem',
          lineHeight: '1.4em',
          fontWeight: 300,
          color: 'inherit',
          marginTop: 20,
          marginBottom: 10,
        },
        h4: {
          fontSize: '1.125rem',
          lineHeight: '1.5em',
          fontWeight: 300,
          color: 'inherit',
          marginTop: 10,
          marginBottom: 10,
        },
        h5: {
          fontSize: '1.0625rem',
          lineHeight: '1.55em',
          fontWeight: 300,
          color: 'inherit',
          marginTop: 10,
          marginBottom: 10,
        },
        h6: {
          fontSize: '0.75rem',
          textTransform: 'uppercase',
          lineHeight: '1.5em',
          fontWeight: 500,
          color: 'inherit',
          marginTop: 10,
          marginBottom: 10,
        },
        label: {
          fontSize: 14,
          lineHeight: 1.42857,
          // color: '#aaa',
        },
        'label, small': {
          fontWeight: 400,
        },
        small: {
          fontSize: '75%',
          // color: '#777',
        },
        form: {
          marginBottom: '1.125rem',
        },
        a: {
          color: primaryColor,
          backgroundColor: 'initial',
        },
        'a, a:focus, a:hover': {
          textDecoration: 'none',
        },
        'a:focus, a:hover': {
          color: primaryColor,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          letterSpacing: '0.02875em',
        },
      },
    },
    MuiTableSortLabel: {
      styleOverrides: {
        root: {
          '&:hover': {
            color: 'inherit',
          },
        },
      },
    },
    MuiDialogActions: {
      styleOverrides: {
        root: {
          padding: '8px 24px',
        },
      },
    },
    MuiDialogContentText: {
      styleOverrides: {
        root: {
          paddingBottom: 12,
        },
      },
    },
  },
  mixins: {
    boxShadow: {
      primary: buildGradientShadow(primaryColor),
      secondary: buildGradientShadow(secondaryColor),
      error: buildGradientShadow(dangerColor),
      warning: buildGradientShadow(warningColor),
      info: buildGradientShadow(infoColor),
      success: buildGradientShadow(successColor),
      page: '0 16px 24px 2px rgba(0, 0, 0, 0.14), 0 6px 30px 5px rgba(0, 0, 0, 0.12), 0 8px 10px -5px rgba(0, 0, 0, 0.2)',
    },
  },
  palette: {
    mode: 'light',
    primary: {
      main: primaryColor,
    },
    secondary: {
      main: secondaryColor,
    },
    error: {
      main: dangerColor,
    },
    warning: {
      main: warningColor,
    },
    info: {
      main: infoColor,
    },
    success: {
      main: successColor,
    },
    background: {
      paper: '#fff',
      default: '#fafafa',
    },
  },
} as const)
