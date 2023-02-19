import { FormikHelpers } from 'formik'
import React, { useMemo } from 'react'
import { EditDialog, OnCloseHandler } from 'ui'
import { ProfileFormType, useAuth, useConfiguration, useUser, useYearFilter } from 'amber'
import { fromSlotsAttending, toSlotsAttending, useEditMembership } from 'amber/utils/membershipUtils'

import type { MembershipType } from 'amber/utils/apiTypes'
import { MembershipStepVirtual } from './MembershipStepVirtual'
import { getDefaultMembership, getOwed, membershipValidationSchema } from './membershipUtils'

type FormValues = MembershipType

interface MembershipDialogProps {
  open: boolean
  onClose: OnCloseHandler
  initialValues?: MembershipType
  profile: ProfileFormType
}

export const MembershipDialog: React.FC<MembershipDialogProps> = ({ open, onClose, profile, initialValues }) => {
  const configuration = useConfiguration()
  const { user } = useAuth()
  const { userId } = useUser()
  const createOrUpdateMembership = useEditMembership(onClose, getOwed)
  const [year] = useYearFilter()
  const isVirtual = configuration.startDates[year].virtual

  if (!user) {
    throw new Error('login expired')
  } // todo test this

  const onSubmit = async (values: FormValues, actions: FormikHelpers<FormValues>) => {
    // eslint-disable-next-line no-param-reassign
    values.slotsAttending = toSlotsAttending(values)
    await createOrUpdateMembership(values, profile)
  }

  const values = useMemo(() => {
    // note that for Virtual, we only really care about acceptance and the list of possible slots that they know that they won't attend.
    // everything else is very hotel centric
    const defaultValues: MembershipType = getDefaultMembership(configuration, userId!, isVirtual)
    const _values = initialValues ? { ...initialValues } : { ...defaultValues }
    _values.slotsAttendingData = fromSlotsAttending(configuration, _values)
    return _values
  }, [configuration, initialValues, isVirtual, userId])

  return (
    <EditDialog
      initialValues={values}
      onClose={onClose}
      open={open}
      onSubmit={onSubmit}
      title='Membership'
      validationSchema={membershipValidationSchema}
      isEditing
    >
      <MembershipStepVirtual />
    </EditDialog>
  )
}
