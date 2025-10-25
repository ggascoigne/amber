import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import type { Theme } from '@mui/material/styles'
import { styled } from '@mui/material/styles'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'

import { ThemeToggle } from '@/Components/ThemeToggle'

// This Offsets the height of the AppBar to allow no overlap in content below
const Offset = styled('div')(({ theme }) => theme.mixins.toolbar)

const NavigationAppBar = () => (
  <>
    <AppBar position='fixed' sx={{ zIndex: (theme: Theme) => theme.zIndex.drawer + 1 }}>
      <Toolbar>
        <Box
          sx={{
            pl: [0, 2],
            maxWidth: ['calc(100% - 150px)', 'inherit'],
          }}
        >
          <Typography
            variant='h6'
            sx={{
              width: 'inherit',
              whiteSpace: ['nowrap', 'inherit'],
              overflow: ['hidden', 'inherit'],
              textOverflow: ['ellipsis', 'inherit'],
              pl: 2,
            }}
          >
            Table Test Examples
          </Typography>
        </Box>
        <Box
          sx={{
            display: 'flex',
            flexGrow: 1,
            justifyContent: 'flex-end',
          }}
        >
          <ThemeToggle skipSystem />
        </Box>
      </Toolbar>
    </AppBar>
    <Offset />
  </>
)

export default NavigationAppBar
