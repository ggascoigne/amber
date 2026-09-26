import type { ReactNode } from 'react'
import { useMemo } from 'react'

import type { GameAssignmentDashboardData } from '@amber/client'
import type { WizardPage } from '@amber/ui'
import { Wizard } from '@amber/ui'
import Yup from '@amber/ui/utils/Yup'
import {
  Autocomplete,
  Box,
  Button,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material'
import type { FormikErrors, FormikHelpers, FormikValues } from 'formik'
import { useFormikContext } from 'formik'

import { buildCancellationImpact } from './cancellationImpact'

type CancelPlayerWizardFormValues = {
  memberId: number | null
}

type CancelPlayerWizardProps = {
  data: GameAssignmentDashboardData
  onClose: () => void
  onSubmit: (
    values: CancelPlayerWizardFormValues,
    actions: FormikHelpers<CancelPlayerWizardFormValues>,
  ) => Promise<void>
  open: boolean
}

const validationSchema = Yup.object().shape({
  memberId: Yup.number().nullable().required('Select a member to cancel'),
})

const CapacityGamesTable = ({ games }: { games: ReturnType<typeof buildCancellationImpact>['belowMinimumGames'] }) => (
  <Table size='small'>
    <TableHead>
      <TableRow>
        <TableCell>Game</TableCell>
        <TableCell>Slot</TableCell>
        <TableCell align='right'>Players after cancellation</TableCell>
        <TableCell align='right'>Min</TableCell>
        <TableCell align='right'>Max</TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      {games.map((game) => (
        <TableRow
          key={game.gameId}
          sx={game.isAffectedByCancellation ? { '& .MuiTableCell-root': { fontWeight: 700 } } : undefined}
        >
          <TableCell>{game.gameName}</TableCell>
          <TableCell>{game.slotId ? `Slot ${game.slotId}` : 'Cancelled'}</TableCell>
          <TableCell align='right'>{game.playerCount}</TableCell>
          <TableCell align='right'>{game.playerMin}</TableCell>
          <TableCell align='right'>{game.playerMax}</TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
)

const MemberStep = ({ data }: { data: GameAssignmentDashboardData }) => {
  const { setFieldValue, values } = useFormikContext<CancelPlayerWizardFormValues>()
  const members = useMemo(() => data.memberships.filter((membership) => membership.attending), [data.memberships])
  const selectedMember = members.find((member) => member.id === values.memberId) ?? null

  return (
    <Stack spacing={2}>
      <Typography>Select the attending member who has cancelled.</Typography>
      <Autocomplete
        options={members}
        value={selectedMember}
        getOptionLabel={(member) => member.user.fullName ?? 'Unknown member'}
        isOptionEqualToValue={(option, value) => option.id === value.id}
        onChange={(_event, member) => setFieldValue('memberId', member?.id ?? null)}
        renderInput={(params) => <TextField {...params} label='Member' required />}
      />
    </Stack>
  )
}

const ImpactStep = ({ data }: { data: GameAssignmentDashboardData }) => {
  const { values } = useFormikContext<CancelPlayerWizardFormValues>()
  const impact = useMemo(() => buildCancellationImpact({ data, memberId: values.memberId }), [data, values.memberId])

  return (
    <Stack spacing={3}>
      <Typography>
        This preview removes the selected member from every game and assigns them to No Game in every slot. No changes
        have been made.
      </Typography>
      <Box>
        <Typography variant='subtitle1'>Games Below Minimum Players</Typography>
        {impact.belowMinimumGames.length > 0 ? (
          <CapacityGamesTable games={impact.belowMinimumGames} />
        ) : (
          <Typography color='text.secondary'>No games would be below their player minimum.</Typography>
        )}
      </Box>
      <Box>
        <Typography variant='subtitle1'>Games At Minimum Players</Typography>
        {impact.atMinimumGames.length > 0 ? (
          <CapacityGamesTable games={impact.atMinimumGames} />
        ) : (
          <Typography color='text.secondary'>No games would be at their player minimum.</Typography>
        )}
      </Box>
    </Stack>
  )
}

const ConfirmStep = ({ data }: { data: GameAssignmentDashboardData }) => {
  const { values } = useFormikContext<CancelPlayerWizardFormValues>()
  const member = data.memberships.find((membership) => membership.id === values.memberId)
  const memberName = member?.user.fullName ?? 'this member'

  return (
    <Stack spacing={2}>
      <Typography variant='h6'>Cancel {memberName}?</Typography>
      <Typography>
        Confirming will assign {memberName} to No Game in every slot and mark their membership as not attending.
      </Typography>
      <Typography color='text.secondary'>This action cannot be undone from this dialog.</Typography>
    </Stack>
  )
}

const CancelPlayerSaveButton = ({
  disabled,
  submitForm,
  validateForm,
  children: _children,
}: {
  disabled: boolean
  validateForm: (values?: any) => Promise<FormikErrors<any>>
  submitForm: (() => Promise<void>) & (() => Promise<any>)
  children: ReactNode
}) => (
  <Button variant='contained' color='error' disabled={disabled} onClick={() => validateForm().then(() => submitForm())}>
    Cancel Player
  </Button>
)

export const CancelPlayerWizard = ({ data, onClose, onSubmit, open }: CancelPlayerWizardProps) => {
  const pages = useMemo<WizardPage[]>(
    () => [
      {
        name: 'Member',
        optional: false,
        hasForm: true,
        hasErrors: (errors: FormikErrors<FormikValues>) => !!errors.memberId,
        render: <MemberStep data={data} />,
      },
      { name: 'Impact', optional: false, hasForm: false, render: <ImpactStep data={data} /> },
      { name: 'Confirm', optional: false, hasForm: false, render: <ConfirmStep data={data} /> },
    ],
    [data],
  )

  return (
    <Wizard<CancelPlayerWizardFormValues>
      open={open}
      onClose={onClose}
      pages={pages}
      values={{ memberId: null }}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
      isEditing={false}
      SaveButton={CancelPlayerSaveButton}
    />
  )
}
