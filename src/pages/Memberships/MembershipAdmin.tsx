import { createStyles, makeStyles } from '@material-ui/core'
import { CheckboxWithLabel } from 'components/Form'
import React from 'react'

import { HasPermission, Perms } from '../../components/Auth'
import { GridContainer, GridItem } from '../../components/Grid'
import { Important } from '../../components/Typography'
import { MembershipFormContent } from './membershipUtils'

const useStyles = makeStyles(() =>
  createStyles({
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
  })
)

export const MembershipStepAdmin: React.FC<MembershipFormContent> = ({ prefix = '' }) => {
  const classes = useStyles()

  return (
    <>
      <HasPermission permission={Perms.IsAdmin}>
        <Important className={classes.important}>Admin Mode</Important>
        <GridContainer spacing={2}>
          <GridItem xs={12} md={12}>
            <CheckboxWithLabel label='Attending' name='attending' />
          </GridItem>
          <GridItem xs={12} md={12}>
            <CheckboxWithLabel label='Volunteer' name='volunteer' />
          </GridItem>
        </GridContainer>
      </HasPermission>
    </>
  )
}
