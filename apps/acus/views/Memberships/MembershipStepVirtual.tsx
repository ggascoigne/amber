import React, { useState } from 'react'

import { AdminCard, ConfigDate, Perms, getSlotDescription, isNotPacificTime, useConfiguration } from '@amber/amber'
import type { MembershipFormContent } from '@amber/amber/utils/membershipUtils'
import { CheckboxWithLabel, GridContainer, GridItem, range, TextField } from '@amber/ui'
import { Box, DialogContentText, FormControlLabel, FormGroup, Switch } from '@mui/material'

export const MembershipStepVirtual = ({ prefix = '' }: MembershipFormContent) => {
  const configuration = useConfiguration()
  const [showPT, setShowPT] = useState(false)

  return (
    <>
      <DialogContentText>
        Please select the slots you <strong>intend</strong> to play. To make sure each slot has coverage for every
        player &mdash; and to not disappoint too many GMs by overbooking and then cancelling unnecessary games &mdash;
        we try to get these numbers as accurate as possible.
      </DialogContentText>
      <DialogContentText>
        We are aware that circumstances change, or that the siren song of an excellent game description might pull you
        into a slot you thought you would skip. Just give us your best guess for now. You will be able to edit this
        information up to the Games Due Deadline, <ConfigDate name='gameSubmissionDeadline' />.
      </DialogContentText>
      <DialogContentText>
        Note that some games offered may cover more than one slot time or purposely overrun their slot times. This will
        be specified in the game book once it is published. In addition, there may be other game times available
        &ldquo;overnight&rdquo; Pacific time &mdash; that is, during the day U.K. and European time. These will be
        organized separately from the ACNW main game book.
      </DialogContentText>
      <Box sx={{ position: 'relative', pt: 0 }}>
        {isNotPacificTime(configuration) && (
          <div>
            <FormControlLabel
              control={
                <Switch
                  checked={showPT}
                  onChange={() => setShowPT((old) => !old)}
                  name={`${prefix}showLocal`}
                  color='primary'
                />
              }
              label='Show slot times in Pacific time'
            />
          </div>
        )}
        <FormGroup>
          {range(configuration.numberOfSlots).map((i) => (
            <CheckboxWithLabel
              key={i}
              label={getSlotDescription(configuration, {
                year: configuration.year,
                slot: i + 1,
                local: !showPT,
              })}
              Label={{ labelPlacement: 'end' }}
              name={`${prefix}slotsAttendingData[${i}]`}
            />
          ))}
        </FormGroup>
      </Box>
      <GridContainer spacing={2}>
        <GridItem size={{ xs: 12, md: 12 }}>
          <TextField name={`${prefix}message`} label='Messages' margin='normal' fullWidth multiline />
        </GridItem>
        <AdminCard permission={Perms.IsAdmin}>
          <GridItem size={{ xs: 12, md: 12 }}>
            <CheckboxWithLabel label='Attending' name='attending' />
          </GridItem>
          <GridItem size={{ xs: 12, md: 12 }}>
            <CheckboxWithLabel label='Volunteer' name='volunteer' />
          </GridItem>
        </AdminCard>
      </GridContainer>
    </>
  )
}
