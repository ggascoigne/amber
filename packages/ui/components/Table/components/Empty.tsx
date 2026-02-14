import { useMemo } from 'react'

import ManageSearchIcon from '@mui/icons-material/ManageSearch'
import SearchOffIcon from '@mui/icons-material/SearchOff'
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import { alpha, useTheme } from '@mui/material/styles'

import { clearSearchAndAllFilters } from '../filter/filterEmitter'

type EmptyProps = { hasSearch: boolean; clearSearch?: () => void }

export const Empty = ({ hasSearch, clearSearch = clearSearchAndAllFilters }: EmptyProps) => {
  const theme = useTheme()
  const avatarSx = useMemo(() => {
    const color = theme.palette.primary.main
    const bgcolor = alpha(color, 0.12)
    return { width: 56, height: 56, color, bgcolor, '& svg': { height: '24px', width: '24px' }, mb: 2 }
  }, [theme])

  return (
    <Box
      sx={{
        width: '100%',
        minHeight: '400px',
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 1,
        p: 3,
      }}
    >
      <Box
        sx={{
          width: '100%',
          minHeight: '400px',
          p: 2,
          border: (t) => `1px solid ${t.palette.divider}`,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          flexGrow: 1,
        }}
      >
        {hasSearch ? (
          <>
            <Avatar sx={avatarSx}>
              <ManageSearchIcon />
            </Avatar>
            <Box>No matching records</Box>
            <Box>Use the search or filters to improve your results</Box>
            {clearSearch && <Button onClick={clearSearch}>Clear Search</Button>}
          </>
        ) : (
          <>
            <Avatar sx={avatarSx}>
              <SearchOffIcon />
            </Avatar>
            <Box>Empty result set</Box>
          </>
        )}
      </Box>
    </Box>
  )
}
