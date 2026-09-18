import CommentOutlinedIcon from '@mui/icons-material/CommentOutlined'
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined'
import { Box, IconButton, Tooltip, Typography } from '@mui/material'

type SignupNoteIndicatorProps = { memberName: string; message: string; onHide: () => void }

export const SignupNoteIndicator = ({ memberName, message, onHide }: SignupNoteIndicatorProps) => (
  <Tooltip
    title={
      <Box sx={{ position: 'relative', maxWidth: 320, pr: 3.5 }}>
        <Typography variant='body2' sx={{ whiteSpace: 'pre-wrap', overflowWrap: 'anywhere' }}>
          {message}
        </Typography>
        <IconButton
          aria-label={`Hide signup note for ${memberName}`}
          color='inherit'
          size='small'
          sx={{ position: 'absolute', top: -4, right: -4 }}
          onClick={(event) => {
            event.stopPropagation()
            onHide()
          }}
        >
          <VisibilityOffOutlinedIcon fontSize='small' />
        </IconButton>
      </Box>
    }
  >
    <IconButton
      aria-label={`View signup note for ${memberName}`}
      size='small'
      sx={{ ml: 0.25, mt: -0.25, p: 0, width: 14, height: 14, verticalAlign: 'baseline' }}
      onClick={(event) => event.stopPropagation()}
    >
      <CommentOutlinedIcon sx={{ fontSize: 13 }} />
    </IconButton>
  </Tooltip>
)
