import CloseIcon from '@mui/icons-material/Close'
import { IconButton, Theme } from '@mui/material'
import { amber, green } from '@mui/material/colors'
import { OptionsObject, SnackbarProvider, VariantType, useSnackbar } from 'notistack'
import { PropsWithChildren, default as React, ReactElement, useCallback } from 'react'
import { makeStyles } from 'tss-react/mui'

const useSnackbarStyles = makeStyles()((theme: Theme) => ({
  success: {
    backgroundColor: green[600],
  },
  error: {
    backgroundColor: theme.palette.error.dark,
  },
  info: {
    backgroundColor: theme.palette.primary.main,
  },
  warning: {
    backgroundColor: amber[700],
  },
  icon: {
    fontSize: 20,
  },
  containerRoot: {
    top: theme.spacing(9.5),
    right: theme.spacing(2),
  },
  rootContainer: {
    maxWidth: 600,
  },
}))

export const NotificationProvider: React.FC<PropsWithChildren<unknown>> = ({ children }) => {
  const { classes } = useSnackbarStyles()
  return (
    <SnackbarProvider
      classes={{
        variantSuccess: classes.success,
        variantError: classes.error,
        variantWarning: classes.warning,
        variantInfo: classes.info,
        root: classes.rootContainer,
        containerRoot: classes.containerRoot,
      }}
      maxSnack={10}
      data-test='snackbar-notification'
    >
      {children}
    </SnackbarProvider>
  )
}

const SnackBarActionHandler: React.FC<{ keyValue: OptionsObject['key'] }> = ({ keyValue }) => {
  const { closeSnackbar } = useSnackbar()
  const { classes } = useSnackbarStyles()
  return (
    <IconButton
      key='close'
      aria-label='Close'
      color='inherit'
      onClick={() => closeSnackbar(keyValue)}
      data-test='snackbar-action-button'
      size='large'
    >
      <CloseIcon className={classes.icon} />
    </IconButton>
  )
}

interface Snackbar {
  text: string | ReactElement
  variant: VariantType
  options?: OptionsObject
}

export const useNotification = () => {
  const { enqueueSnackbar } = useSnackbar()

  return useCallback(
    ({ text, variant, options = {} }: Snackbar) =>
      enqueueSnackbar(text, {
        variant,
        disableWindowBlurListener: true,
        autoHideDuration: variant !== 'error' ? 6000 : null,
        anchorOrigin: { vertical: 'top', horizontal: 'right' },
        action: (keyValue) => <SnackBarActionHandler keyValue={keyValue} />,
        ...options,
      }),
    [enqueueSnackbar]
  )
}
