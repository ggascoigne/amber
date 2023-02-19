import { FormikErrors, FormikValues } from 'formik'
import React from 'react'
import { makeStyles } from 'tss-react/mui'
import { CheckboxWithLabel, GridContainer, GridItem, Important } from 'ui'

import { HasPermission, Perms } from 'amber'
import { hasMembershipStepErrors, MembershipErrorType, MembershipFormContent } from 'amber/utils/membershipUtils'

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
    <>
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
    </>
  )
}
