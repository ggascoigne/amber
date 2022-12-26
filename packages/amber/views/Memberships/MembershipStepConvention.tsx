import { DialogContentText } from '@mui/material'
import { FormikErrors, FormikValues } from 'formik'
import React from 'react'
import { CheckboxWithLabel, GridContainer, GridItem, RadioGroupFieldWithLabel } from 'ui'

import { Acnw, ConventionsDatesFull } from '../../components'
import { attendanceOptions, configuration, interestOptions } from '../../utils'
import { hasMembershipStepErrors, MembershipErrorType, MembershipFormContent } from './membershipUtils'

export const hasConventionStepErrors = (errors: FormikErrors<FormikValues>) =>
  hasMembershipStepErrors(
    'convention',
    errors?.membership as MembershipErrorType,
    'attendance',
    'interestLevel',
    'offerSubsidy'
  )

export const MembershipStepConvention: React.FC<MembershipFormContent> = ({ prefix = '' }) => (
  <>
    <DialogContentText>
      Per Edgefield's room policy, you must be at least 18 or older to register. If you are younger and wish to attend,
      please contact Simone at <Acnw.ContactEmail />.
    </DialogContentText>
    <DialogContentText>
      I plan to attend AmberCon Northwest, <ConventionsDatesFull pre='from' intra='through' post=',' /> at McMenamin's
      Edgefield Bed & Breakfast in Troutdale, Oregon. I understand that my hotel room is held but not reserved until I
      have paid my membership fee in full and received confirmation from the organizers.
    </DialogContentText>
    <h3>Convention Registration</h3>
    <DialogContentText component='div'>
      <strong>Full Membership - ${configuration.fourDayMembership}</strong> includes
      <ul>
        <li>up to all {configuration.numberOfSlots} game slots, Thursday evening through Sunday evening</li>
        <li>a ${configuration.fourDayVoucher} meal card</li>
        <li>3 breakfasts</li>
        <li>snacks, tea and coffee during the day.</li>
      </ul>
      <strong>Short Membership - ${configuration.threeDayMembership}</strong> includes
      <ul>
        <li>up to 4 game slots, Friday evening through Sunday evening, for example</li>
        <li>a ${configuration.threeDayVoucher} meal card</li>
        <li>2 breakfasts</li>
        <li>snacks, tea and coffee during the day.</li>
      </ul>
    </DialogContentText>
    <GridContainer spacing={2}>
      <GridItem xs={12} md={12}>
        <RadioGroupFieldWithLabel
          aria-label='Select Membership'
          label='Select Membership'
          name={`${prefix}attendance`}
          selectValues={attendanceOptions}
        />
      </GridItem>
      <GridItem xs={12} md={12}>
        <DialogContentText>
          AmberCon currently accepts payment only by check or money order. Payment instructions are at the bottom of
          this page.
        </DialogContentText>
        <RadioGroupFieldWithLabel
          aria-label='Payment'
          name={`${prefix}interestLevel`}
          label='Payment'
          selectValues={interestOptions}
        />
      </GridItem>
    </GridContainer>
    <h4>Need Help & Give Help</h4>
    <DialogContentText>
      With all of the changes due to COVID this year, we have had to implement a significant price increase. Through the
      extraordinary generosity of our members, however, AmberCon NW can offer a small number of registrations at the a
      subsidized rate of ${configuration.subsidizedMembership} for full memberships and $
      {configuration.subsidizedMembershipShort} for short memberships.
    </DialogContentText>
    <DialogContentText>
      If you would like to take advantage of this support, or if you are one of the people who would like to contribute
      to help others, please check the appropriate boxes below.
    </DialogContentText>
    <GridContainer spacing={2} sx={{ mb: 2, ml: 1 }}>
      <GridItem xs={12} md={12}>
        <CheckboxWithLabel label='To contribute to the fund, check this box' name={`${prefix}offerSubsidy`} />
      </GridItem>
      <GridItem xs={12} md={12} style={{ paddingTop: 0 }}>
        <CheckboxWithLabel
          label='To receive a subsidized membership rate, check this box'
          name={`${prefix}requestOldPrice`}
        />
      </GridItem>
    </GridContainer>
    <DialogContentText>
      While this selection will show to you on your registration page and to us for administration, it will be otherwise
      anonymous.
    </DialogContentText>
  </>
)
