import { Box, Typography } from '@mui/material'

type RoomNameWithMembersCellProps = {
  roomDescription: string
  assignedMemberNames: Array<string>
}

const RoomNameWithMembersCell = ({ roomDescription, assignedMemberNames }: RoomNameWithMembersCellProps) => (
  <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', gap: 0.5 }}>
    <Box component='span'>{roomDescription}</Box>
    {assignedMemberNames.length > 0 ? (
      <Typography component='span' variant='caption' color='text.secondary'>
        ({assignedMemberNames.join(', ')})
      </Typography>
    ) : null}
  </Box>
)

export default RoomNameWithMembersCell
