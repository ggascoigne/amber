import type { ReactNode } from 'react'

import { Loader } from '@amber/ui'
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Table as MuiTable,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'

export type AssignmentSummaryData = {
  missingAssignments: Array<{
    memberId: number
    memberName: string
    missingSlots: Array<number>
  }>
  anyGameAssignments: Array<{
    memberId: number
    memberName: string
    gameName: string
    assignmentRole: string
  }>
  noGameRoleMismatches: Array<{
    gameId: number
    gameName: string
    slotId: number
    gmCount: number
    playerCount: number
  }>
  belowMinimumGames: Array<{
    gameId: number
    gameName: string
    slotId: number | null
    playerCount: number
    playerMin: number
    playerMax: number
  }>
  overCapGames: Array<{
    gameId: number
    gameName: string
    slotId: number | null
    playerCount: number
    playerMin: number
    playerMax: number
  }>
}

type AssignmentSummarySectionProps = {
  title: string
  emptyMessage: string
  hasRows: boolean
  children: ReactNode
}

const AssignmentSummarySection = ({ title, emptyMessage, hasRows, children }: AssignmentSummarySectionProps) => (
  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.25 }}>
    <Typography variant='subtitle1' component='h3'>
      {title}
    </Typography>
    {hasRows ? children : <Typography color='text.secondary'>{emptyMessage}</Typography>}
  </Box>
)

type AssignmentSummaryDialogProps = {
  open: boolean
  onClose: () => void
  isLoading: boolean
  data: AssignmentSummaryData | undefined
  errorMessage: string | null
}

export const AssignmentSummaryDialog = ({
  open,
  onClose,
  isLoading,
  data,
  errorMessage,
}: AssignmentSummaryDialogProps) => (
  <Dialog open={open} onClose={onClose} maxWidth='lg' fullWidth>
    <DialogTitle>Game Assignment Summary</DialogTitle>
    <DialogContent dividers>
      <Stack spacing={3}>
        {isLoading ? (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', py: 4 }}>
            <Loader />
          </Box>
        ) : null}
        {!isLoading && errorMessage ? <Typography color='error.main'>{errorMessage}</Typography> : null}
        {!isLoading && !errorMessage && data ? (
          <>
            <AssignmentSummarySection
              title='Players Missing Assignments'
              emptyMessage='No members are missing assignments.'
              hasRows={data.missingAssignments.length > 0}
            >
              <TableContainer>
                <MuiTable size='small'>
                  <TableHead>
                    <TableRow>
                      <TableCell>Member</TableCell>
                      <TableCell>Missing Slots</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data.missingAssignments.map((entry) => (
                      <TableRow key={entry.memberId}>
                        <TableCell>{entry.memberName}</TableCell>
                        <TableCell>{entry.missingSlots.map((slotId) => `Slot ${slotId}`).join(', ')}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </MuiTable>
              </TableContainer>
            </AssignmentSummarySection>
            <AssignmentSummarySection
              title='Members Assigned To Any Game'
              emptyMessage='No members are assigned to Any Game.'
              hasRows={data.anyGameAssignments.length > 0}
            >
              <TableContainer>
                <MuiTable size='small'>
                  <TableHead>
                    <TableRow>
                      <TableCell>Member</TableCell>
                      <TableCell>Role</TableCell>
                      <TableCell>Game</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data.anyGameAssignments.map((entry, index) => (
                      <TableRow key={`${entry.memberId}-${entry.assignmentRole}-${index}`}>
                        <TableCell>{entry.memberName}</TableCell>
                        <TableCell>{entry.assignmentRole}</TableCell>
                        <TableCell>{entry.gameName}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </MuiTable>
              </TableContainer>
            </AssignmentSummarySection>
            <AssignmentSummarySection
              title='No Game GM/Player Mismatches'
              emptyMessage='No No Game GM/player mismatches found.'
              hasRows={data.noGameRoleMismatches.length > 0}
            >
              <TableContainer>
                <MuiTable size='small'>
                  <TableHead>
                    <TableRow>
                      <TableCell>Game</TableCell>
                      <TableCell>Slot</TableCell>
                      <TableCell align='right'>GM Count</TableCell>
                      <TableCell align='right'>Player Count</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data.noGameRoleMismatches.map((entry) => (
                      <TableRow key={entry.gameId}>
                        <TableCell>{entry.gameName}</TableCell>
                        <TableCell>{`Slot ${entry.slotId}`}</TableCell>
                        <TableCell align='right'>{entry.gmCount}</TableCell>
                        <TableCell align='right'>{entry.playerCount}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </MuiTable>
              </TableContainer>
            </AssignmentSummarySection>
            <AssignmentSummarySection
              title='Games Below Minimum Players'
              emptyMessage='No games are below their player minimum.'
              hasRows={data.belowMinimumGames.length > 0}
            >
              <TableContainer>
                <MuiTable size='small'>
                  <TableHead>
                    <TableRow>
                      <TableCell>Game</TableCell>
                      <TableCell>Slot</TableCell>
                      <TableCell align='right'>Players</TableCell>
                      <TableCell align='right'>Min</TableCell>
                      <TableCell align='right'>Max</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data.belowMinimumGames.map((entry) => (
                      <TableRow key={entry.gameId}>
                        <TableCell>{entry.gameName}</TableCell>
                        <TableCell>{entry.slotId ? `Slot ${entry.slotId}` : 'Unslotted'}</TableCell>
                        <TableCell align='right'>{entry.playerCount}</TableCell>
                        <TableCell align='right'>{entry.playerMin}</TableCell>
                        <TableCell align='right'>{entry.playerMax}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </MuiTable>
              </TableContainer>
            </AssignmentSummarySection>
            <AssignmentSummarySection
              title='Games Over Player Cap'
              emptyMessage='No games are above their player cap.'
              hasRows={data.overCapGames.length > 0}
            >
              <TableContainer>
                <MuiTable size='small'>
                  <TableHead>
                    <TableRow>
                      <TableCell>Game</TableCell>
                      <TableCell>Slot</TableCell>
                      <TableCell align='right'>Players</TableCell>
                      <TableCell align='right'>Min</TableCell>
                      <TableCell align='right'>Max</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data.overCapGames.map((entry) => (
                      <TableRow key={entry.gameId}>
                        <TableCell>{entry.gameName}</TableCell>
                        <TableCell>{entry.slotId ? `Slot ${entry.slotId}` : 'Unslotted'}</TableCell>
                        <TableCell align='right'>{entry.playerCount}</TableCell>
                        <TableCell align='right'>{entry.playerMin}</TableCell>
                        <TableCell align='right'>{entry.playerMax}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </MuiTable>
              </TableContainer>
            </AssignmentSummarySection>
          </>
        ) : null}
      </Stack>
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose}>Close</Button>
    </DialogActions>
  </Dialog>
)
