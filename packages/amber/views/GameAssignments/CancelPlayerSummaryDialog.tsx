import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'

export type CancelPlayerSummary = {
  affectedGameMasters: Array<{
    email: string
    gameName: string
    gmName: string
    slotId: number
  }>
}

type CancelPlayerSummaryDialogProps = {
  onClose: () => void
  summary: CancelPlayerSummary | null
}

export const CancelPlayerSummaryDialog = ({ onClose, summary }: CancelPlayerSummaryDialogProps) => (
  <Dialog open={summary !== null} onClose={onClose} maxWidth='md' fullWidth>
    <DialogTitle>Player Cancellation Summary</DialogTitle>
    <DialogContent dividers>
      <Typography sx={{ mb: 2 }}>The player has been assigned to No Game and marked as not attending.</Typography>
      {summary && summary.affectedGameMasters.length > 0 ? (
        <Table size='small'>
          <TableHead>
            <TableRow>
              <TableCell>GM</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Slot</TableCell>
              <TableCell>Game</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {summary.affectedGameMasters.map((entry) => (
              <TableRow key={`${entry.slotId}-${entry.gameName}-${entry.email}`}>
                <TableCell>{entry.gmName}</TableCell>
                <TableCell>{entry.email}</TableCell>
                <TableCell>{`Slot ${entry.slotId}`}</TableCell>
                <TableCell>{entry.gameName}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <Typography color='text.secondary'>No GMs were assigned to games affected by this cancellation.</Typography>
      )}
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose}>Close</Button>
    </DialogActions>
  </Dialog>
)
