import { DialogContentText } from '@material-ui/core'
import { CheckboxWithLabel, RadioGroupFieldWithLabel } from 'components/Form'
import React from 'react'

import { Acnw, ConventionsDatesFull, configDate } from '../../components'
import { GridContainer, GridItem } from '../../components/Grid'
import { configuration } from '../../utils'
import { MembershipFormContent } from './membershipUtils'

const attendanceSelectValues = [
  {
    value: 'Thurs-Sun',
    text: `Full: $${configuration.fourDayMembership}.`,
  },
  {
    value: 'Fri-Sun',
    text: `Short: $${configuration.threeDayMembership}.`,
  },
]

const interestSelectValues = [
  {
    value: 'Full',
    text: 'I am sending payment in full now',
  },
  {
    value: 'Deposit',
    text: `I am paying a deposit of $${configuration.deposit} now. I understand payment in full is due ${configDate(
      'paymentDeadline'
    )}.`,
  },
]

export const MembershipStepConvention: React.FC<MembershipFormContent> = ({ prefix = '' }) => (
  <>
    <DialogContentText>
      If you like what you've seen so far and are interested in attending ACNW <Acnw.ConventionYear skipSpace='after' />
      , then this form is your first step. Fill it out, preview it, and send it off to us. Registration confirmations
      are emailed to you automatically upon completion, if you don't receive this confirmation, let us know as soon as
      possible at
      <Acnw.ContactEmail />.
    </DialogContentText>
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
      <strong>Full Membership</strong> includes
      <ul>
        <li>up to all 7 game slots, Thursday evening through Sunday evening</li>
        <li>a ${configuration.fourDayVoucher} meal card</li>
        <li>3 breakfasts</li>
        <li>snacks, tea and coffee during the day.</li>
      </ul>
      <strong>Short Membership</strong> includes
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
          selectValues={attendanceSelectValues}
        />
      </GridItem>
      <GridItem xs={12} md={12}>
        <DialogContentText>
          AmberCon currently accepts payment only by check or money order. Payment instructions are at the bottom of
          this page.
        </DialogContentText>
        <RadioGroupFieldWithLabel
          aria-label='Payment'
          name={`${prefix}interest`}
          label='Payment'
          selectValues={interestSelectValues}
        />
      </GridItem>
    </GridContainer>
    <h4>Give Help</h4>
    <DialogContentText>
      With all of the changes due to COVID this year, we have had to implement a significant price increase. If you are
      one of the people who would like to contribute to help others, please check the appropriate box below.
    </DialogContentText>
    <DialogContentText>
      While this selection will show to you on your registration page and to us for administration, it will be otherwise
      anonymous.
    </DialogContentText>
    <GridContainer spacing={2}>
      <GridItem xs={12} md={12}>
        <CheckboxWithLabel label='To sign up to provide assistance, check this box' name={`${prefix}offerSubsidy`} />
      </GridItem>
    </GridContainer>
  </>
)
