import type { ReactNode } from 'react'

import { Clear as ClearIcon } from '@mui/icons-material'
import type { Theme } from '@mui/material'
import { Box, Button, Typography } from '@mui/material'

import { FilterButtonMenu } from './FilterButtonMenu'

type FilterStatusButtonRenderProps = {
  closeEditor: (reason: any) => void
}

type FilterStatusButtonProps = {
  filterName: string
  value: string
  renderEditor: (props: FilterStatusButtonRenderProps) => ReactNode
  onClear: () => void
  onLoseFocus?: () => void
  autoOpen?: boolean
}

export const FilterStatusButton = ({
  filterName,
  value,
  renderEditor,
  onClear,
  onLoseFocus,
  autoOpen = false,
}: FilterStatusButtonProps) => (
  <FilterButtonMenu
    title={
      <>
        <Typography
          variant='body2'
          sx={{
            color: 'action.active',
            pr: 1,
          }}
        >
          {filterName}
        </Typography>
        <Typography
          variant='subtitle2'
          component='p'
          sx={{
            color: 'action.active',
            lineHeight: 1.43,
          }}
        >
          {value}
        </Typography>
      </>
    }
    onLoseFocus={onLoseFocus}
    autoOpen={autoOpen}
    renderChildren={({ closePopup }) => (
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <Box
          sx={{
            height: '40px',
            width: '100%',
            borderBottom: (theme: Theme) => `1px solid ${theme.palette.divider}`,
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            p: (theme: Theme) => theme.spacing(1, 1, 1, 2),
          }}
        >
          <Typography
            variant='subtitle1'
            component='p'
            sx={{
              color: 'action.active',
              lineHeight: 1.43,
            }}
          >
            {filterName}
          </Typography>
          <Button
            onClick={() => {
              onClear()
              closePopup()
            }}
            startIcon={<ClearIcon />}
          >
            Clear
          </Button>
        </Box>
        {renderEditor({
          closeEditor: closePopup,
        })}
      </Box>
    )}
  />
)
