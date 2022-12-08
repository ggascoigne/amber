import CloseIcon from '@mui/icons-material/Close'
import { Box, IconButton, useTheme } from '@mui/material'
import { amber, green } from '@mui/material/colors'
import {
  CustomContentProps,
  OptionsObject,
  SnackbarContent,
  SnackbarProvider,
  useSnackbar,
  VariantType,
} from 'notistack'
import React, { useCallback } from 'react'
import { Children } from '@/utils'

const MySnackbar = React.forwardRef<HTMLDivElement, CustomContentProps>((props, forwardedRef) => {
  const { id, message, action: componentOrFunctionAction, iconVariant, variant, hideIconVariant, style } = props
  const theme = useTheme()

  const icon = iconVariant[variant]

  let action = componentOrFunctionAction
  if (typeof action === 'function') {
    action = action(id)
  }
  const bgColor = {
    default: green[600],
    success: green[600],
    error: theme.palette.error.dark,
    info: theme.palette.primary.main,
    warning: amber[700],
  }[variant]

  const styles = {
    ...{
      backgroundColor: bgColor,
      fontSize: '0.875rem',
      lineHeight: 1.43,
      letterSpacing: '0.01071em',
      color: '#fff',
      alignItems: 'center',
      padding: '6px 16px',
      borderRadius: '4px',
      boxShadow: '0px 3px 5px -1px rgba(0,0,0,0.2),0px 6px 10px 0px rgba(0,0,0,0.14),0px 1px 18px 0px rgba(0,0,0,0.12)',
      paddingLeft: !hideIconVariant && icon ? `${8 * 2.5}px` : undefined,
    },
    ...style,
  }

  return (
    <SnackbarContent ref={forwardedRef} role='alert' style={styles}>
      <Box id='notistack-snackbar' sx={{ display: 'flex', alignItems: 'center', padding: '8px 0' }}>
        {!hideIconVariant ? icon : null}
        {message}
      </Box>
      {action && (
        <Box
          sx={{ display: 'flex', alignItems: 'center', marginLeft: 'auto', paddingLeft: '16px', marginRight: '-8px' }}
        >
          {action}
        </Box>
      )}
    </SnackbarContent>
  )
})

export const NotificationProvider: React.FC<Children> = ({ children }) => (
  <SnackbarProvider
    Components={{
      default: MySnackbar,
      success: MySnackbar,
      info: MySnackbar,
      error: MySnackbar,
      warning: MySnackbar,
    }}
    maxSnack={10}
    data-test='snackbar-notification'
  >
    {children}
  </SnackbarProvider>
)

const SnackBarActionHandler: React.FC<{ keyValue: OptionsObject['key'] }> = ({ keyValue }) => {
  const { closeSnackbar } = useSnackbar()
  return (
    <IconButton
      key='close'
      aria-label='Close'
      color='inherit'
      onClick={() => closeSnackbar(keyValue)}
      data-test='snackbar-action-button'
      size='large'
    >
      <CloseIcon sx={{ fontSize: '20px' }} />
    </IconButton>
  )
}

interface Snackbar {
  text: string
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
        autoHideDuration: /* variant !== 'error' ? 6000 : */ null,
        anchorOrigin: { vertical: 'top', horizontal: 'right' },
        action: (keyValue) => <SnackBarActionHandler keyValue={keyValue} />,
        ...options,
      }),
    [enqueueSnackbar]
  )
}
