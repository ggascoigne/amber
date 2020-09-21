import { Button, Dialog, DialogActions, useTheme } from '@material-ui/core'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import { DialogTitle, ProfileType, useAuth } from 'components/Acnw'
import { Form, Formik, FormikHelpers } from 'formik'
import React, { useMemo } from 'react'
import { onCloseHandler, useUser } from 'utils'

import { MembershipStep } from './MembershipStep'
import {
  MembershipType,
  fromSlotsAttending,
  getDefaultMembership,
  membershipValidationSchema,
  toSlotsAttending,
  useEditMembership,
} from './membershipUtils'

type FormValues = MembershipType

interface MembershipDialog {
  open: boolean
  onClose: onCloseHandler
  initialValues?: MembershipType
  profile: ProfileType | null
}

// what hard coded lists did the old system map to
// const legacyValueLists = {
//   interestLevel: ['Full', 'Deposit'],
//   attendance: ['Thurs-Sun', 'Fri-Sun'],
//   roomingPreferences: ['room-with', 'assign-me', 'other'],
// }

export const MembershipDialog: React.FC<MembershipDialog> = ({ open, onClose, profile, initialValues }) => {
  const { isAuthenticated, user } = useAuth()
  const { userId } = useUser()
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'))
  const createOrUpdateMembership = useEditMembership(profile!, onClose)

  if (!isAuthenticated || !user) {
    throw new Error('login expired')
  } // todo test this

  const onSubmit = async (values: FormValues, actions: FormikHelpers<FormValues>) => {
    values.slotsAttending = toSlotsAttending(values)
    await createOrUpdateMembership(values)
  }

  const values = useMemo(() => {
    // note that for ACNW Virtual, we only really care about acceptance and the list of possible slots that they know that they won't attend.
    // everything else is very hotel centric
    const defaultValues: MembershipType = getDefaultMembership(userId!)
    const _values = initialValues ? { ...initialValues } : { ...defaultValues }
    _values.slotsAttendingData = fromSlotsAttending(_values)
    return _values
  }, [initialValues, userId])

  return (
    <Dialog disableBackdropClick fullWidth maxWidth='md' fullScreen={fullScreen} open={open} onClose={onClose}>
      <Formik initialValues={values} validationSchema={membershipValidationSchema} onSubmit={onSubmit}>
        {({ values, errors, touched, submitForm, isSubmitting }) => (
          <Form>
            <DialogTitle onClose={onClose}>Edit Membership</DialogTitle>
            <MembershipStep />
            <DialogActions className='modalFooterButtons'>
              <Button onClick={onClose} variant='outlined'>
                Cancel
              </Button>
              <Button type='submit' variant='contained' color='primary' disabled={isSubmitting}>
                Save
              </Button>
            </DialogActions>
          </Form>
        )}
      </Formik>
    </Dialog>
  )
}
