import React from 'react'

import { DialogContentText } from '@mui/material'
import { useGetAttendanceOptions } from 'amber'
import { hasMembershipStepErrors, MembershipErrorType, MembershipFormContent } from 'amber/utils/membershipUtils'
import { FormikErrors, FormikValues } from 'formik'
import { GridContainer, GridItem, RadioGroupFieldWithLabel } from 'ui'

export const hasConventionStepErrors = (errors: FormikErrors<FormikValues>) =>
  hasMembershipStepErrors(
    'convention',
    errors?.membership as MembershipErrorType,
    'attendance',
    'interestLevel',
    'offerSubsidy',
  )

export const MembershipStepConvention: React.FC<MembershipFormContent> = ({ prefix = '' }) => {
  const attendanceOptions = useGetAttendanceOptions()
  return (
    <>
      <h3>Convention Registration</h3>
      <GridContainer spacing={2}>
        <GridItem xs={12} md={12}>
          <RadioGroupFieldWithLabel
            aria-label='Select Membership'
            label='Select Membership'
            name={`${prefix}attendance`}
            selectValues={attendanceOptions}
          />
        </GridItem>
      </GridContainer>
      <DialogContentText component='div'>
        If you require a hotel room, please see{' '}
        <a href='/hotel' target='_new'>
          our hotel page
        </a>{' '}
        for hotel contact details. Hotel registration and convention book are independent.
      </DialogContentText>
    </>
  )
}
