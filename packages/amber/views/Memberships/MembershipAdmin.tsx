import React from 'react'

import { CheckboxWithLabel, GridContainer, GridItem, Important } from '@amber/ui'
import { FormikErrors, FormikValues } from 'formik'
import { makeStyles } from 'tss-react/mui'

import { HasPermission, Perms } from '../../components/Auth'
import { hasMembershipStepErrors, MembershipErrorType, MembershipFormContent } from '../../utils/membershipUtils'

const useStyles = makeStyles()(() => ({
  important: {
    marginBottom: 12,
  },
  slotSelection: {
    position: 'relative',
    paddingTop: 0,
  },
  slotToggleWrapper: {
    position: 'absolute',
    top: 16,
    right: 50,
  },
}))

export const hasAdminStepErrors = (errors: FormikErrors<FormikValues>) =>
  hasMembershipStepErrors('admin', errors?.membership as MembershipErrorType, 'attending', 'volunteer')

export const MembershipStepAdmin: React.FC<MembershipFormContent> = ({ prefix = '' }) => {
  const { classes } = useStyles()

  return (
    <HasPermission permission={Perms.IsAdmin}>
      <Important className={classes.important}>Admin Mode</Important>
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
}
