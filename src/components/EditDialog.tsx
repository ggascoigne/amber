import { Button, Dialog, DialogActions, DialogContent, useMediaQuery, useTheme } from '@material-ui/core'
import { Form, Formik, FormikHelpers } from 'formik'
import { FormikProps } from 'formik/dist/types'
import { ReactElement, ReactNode, useCallback } from 'react'
import { useHotkeys } from 'react-hotkeys-hook'

import { onCloseHandler } from '../utils'
import { HasPermission, Perms, useAuth } from './Auth'
import { DialogTitle } from './Dialog'

export interface EditDialogProps<T> {
  title: string
  initialValues: T
  onSubmit: (values: T, actions: FormikHelpers<T>) => Promise<void>
  open: boolean
  onClose: onCloseHandler
  validationSchema: any
  isEditing: boolean
  children?: ((props: FormikProps<T>) => ReactNode) | ReactNode
}

export const useDisableBackdropClick = (onClose?: onCloseHandler) =>
  useCallback(
    (event: unknown, reason: string) => {
      if (reason !== 'backdropClick') {
        onClose?.()
      }
    },
    [onClose]
  )

export function EditDialog<T>(props: EditDialogProps<T>): ReactElement {
  const { children, initialValues, onSubmit, open, onClose, title, validationSchema, isEditing } = props
  useHotkeys('Escape', onClose, { enableOnTags: ['INPUT', 'TEXTAREA'] })

  const { isAuthenticated, user } = useAuth()
  if (!isAuthenticated || !user) {
    throw new Error('login expired')
  } // todo test this

  const handleClose = useDisableBackdropClick(onClose)

  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'))
  return (
    <Dialog fullWidth maxWidth='md' fullScreen={fullScreen} open={open} onClose={handleClose}>
      <Formik initialValues={initialValues} enableReinitialize validationSchema={validationSchema} onSubmit={onSubmit}>
        {(formikProps) => {
          const { isSubmitting, values, errors } = formikProps
          return (
            <Form>
              <DialogTitle onClose={onClose}>
                {isEditing ? 'Edit' : 'Add'} {title}
              </DialogTitle>
              <DialogContent>{typeof children === 'function' ? children?.(formikProps) : children}</DialogContent>
              <DialogActions className='modalFooterButtons'>
                <HasPermission permission={Perms.IsAdmin}>
                  <Button
                    onClick={() => {
                      console.log(`values = ${JSON.stringify({ values, errors }, null, 2)}`)
                    }}
                    variant='outlined'
                  >
                    Debug
                  </Button>
                </HasPermission>
                <Button onClick={onClose} variant='outlined'>
                  Cancel
                </Button>
                <Button type='submit' variant='contained' color='primary' disabled={isSubmitting}>
                  Save
                </Button>
              </DialogActions>
            </Form>
          )
        }}
      </Formik>
    </Dialog>
  )
}
