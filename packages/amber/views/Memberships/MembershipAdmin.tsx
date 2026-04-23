import type React from 'react'

import { CheckboxWithLabel, Important } from '@amber/ui'
import { Grid } from '@mui/material'
import type { FormikErrors, FormikValues } from 'formik'

import { HasPermission, Perms } from '../../components/Auth'
import type { MembershipErrorType, MembershipFormContent } from '../../utils/membershipUtils'
import { hasMembershipStepErrors } from '../../utils/membershipUtils'

export const hasAdminStepErrors = (errors: FormikErrors<FormikValues>) =>
  hasMembershipStepErrors('admin', errors?.membership as MembershipErrorType, 'attending', 'volunteer')

export const MembershipStepAdmin: React.FC<MembershipFormContent> = ({ prefix = '' }) => (
  <HasPermission permission={Perms.IsAdmin}>
    <Important sx={{ mb: '12px' }}>Admin Mode</Important>
    <Grid container spacing={2}>
      <Grid size={{ xs: 12, md: 12 }}>
        <CheckboxWithLabel label='Attending' name={`${prefix}attending`} />
      </Grid>
      <Grid size={{ xs: 12, md: 12 }}>
        <CheckboxWithLabel label='Volunteer' name={`${prefix}volunteer`} />
      </Grid>
    </Grid>
  </HasPermission>
)
