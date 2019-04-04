import { createMuiTheme } from '@material-ui/core'

import { successCardHeader } from '../../../assets/jss/material-kit-react'

const roundedTop = { borderRadius: '6px 6px 0 0' }
const roundedBottom = { borderRadius: '0 0 6px 6px' }
const rounded = { borderRadius: '6px' }

// I just couldn't work out how to correctly extend the type Overrides, so I just did this in javascript.
// lame, but pragmatic :(
export const getMuiTableTheme = () =>
  createMuiTheme({
    typography: { useNextVariants: true },
    overrides: {
      MUIDataTableHeadCell: {
        root: {
          fontWeight: 900
        }
      },
      MuiToolbar: {
        root: {
          '&:first-child': roundedTop,
          ...successCardHeader
        }
      },
      MUIDataTableToolbar: {
        titleText: {
          color: '#fff',
          fontWeight: 300,
          textTransform: 'none'
        },
        icon: {
          color: '#fff !important',
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.08)'
          }
        }
      },
      MuiTableRow: {
        footer: roundedBottom
      },
      MuiIconButton: {
        root: {
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.08)'
          }
        }
      },
      MUIDataTablePagination: {
        root: {
          '&:last-child': {
            padding: 0,
            ...roundedBottom
          }
        },
        toolbar: {
          '&:first-child': {
            ...roundedBottom
          }
        }
      },
      MuiTablePagination: {
        actions: {
          paddingRight: '24px',
          color: '#fff'
        },
        selectIcon: {
          color: '#fff'
        }
      },
      MuiInput: {
        underline: {
          color: '#fff'
        }
      },
      MuiPaper: {
        rounded: rounded
      },
      MUIDataTableSearch: {
        searchIcon: {
          color: '#fff'
        },
        clearIcon: {
          color: '#fff'
        }
      }
    }
  })
