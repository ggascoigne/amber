import type { ReactNode } from 'react'

import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined'
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined'
import { Box, IconButton, Typography } from '@mui/material'

type MemberSubmissionDetailLayoutProps = {
  children: ReactNode
  submissionMessage?: string | null
  isSubmissionHidden?: boolean
  onSubmissionHiddenChange?: (hidden: boolean) => void
}

export const MemberSubmissionDetailLayout = ({
  children,
  submissionMessage,
  isSubmissionHidden = false,
  onSubmissionHiddenChange,
}: MemberSubmissionDetailLayoutProps) => (
  <Box
    sx={{
      display: 'flex',
      flexDirection: { xs: 'column', md: 'row' },
      gap: 2,
      alignItems: 'stretch',
    }}
  >
    <Box sx={{ flex: 1, minWidth: 0 }}>{children}</Box>
    <Box
      sx={{
        width: { xs: '100%', md: 260 },
        flexShrink: 0,
        border: (theme) => `1px solid ${theme.palette.divider}`,
        borderRadius: 1,
        p: 2,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant='subtitle2' component='h3'>
          Signup Notes
        </Typography>
        {submissionMessage?.trim() ? (
          <IconButton
            aria-label={isSubmissionHidden ? 'Show signup note' : 'Hide signup note'}
            size='small'
            onClick={() => onSubmissionHiddenChange?.(!isSubmissionHidden)}
          >
            {isSubmissionHidden ? (
              <VisibilityOutlinedIcon fontSize='small' />
            ) : (
              <VisibilityOffOutlinedIcon fontSize='small' />
            )}
          </IconButton>
        ) : null}
      </Box>
      {isSubmissionHidden ? null : (
        <Typography variant='body2' color='text.secondary'>
          {submissionMessage ?? 'No submission message.'}
        </Typography>
      )}
    </Box>
  </Box>
)
