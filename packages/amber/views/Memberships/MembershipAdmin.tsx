import React from 'react'

import { CheckboxWithLabel, GridContainer, GridItem, Important } from '@amber/ui'
import { FormikErrors, FormikValues } from 'formik'

import { HasPermission, Perms } from '../../components/Auth'
import { hasMembershipStepErrors, MembershipErrorType, MembershipFormContent } from '../../utils/membershipUtils'

export const hasAdminStepErrors = (errors: FormikErrors<FormikValues>) =>
  hasMembershipStepErrors('admin', errors?.membership as MembershipErrorType, 'attending', 'volunteer')

export const MembershipStepAdmin: React.FC<MembershipFormContent> = ({ prefix = '' }) => (
  <HasPermission permission={Perms.IsAdmin}>
    <Important sx={{ mb: '12px' }}>Admin Mode</Important>
    <GridContainer spacing={2}>
      <GridItem xs={12} md={12}>
        <CheckboxWithLabel label='Attending' name={`${prefix}attending`} />
      </GridItem>
      <GridItem xs={12} md={12}>
        <CheckboxWithLabel label='Volunteer' name={`${prefix}volunteer`} />
      </GridItem>
    </GridContainer>
  </HasPermission>
)
