import ClearIcon from '@mui/icons-material/Clear'
import SearchIcon from '@mui/icons-material/Search'
import { IconButton, InputAdornment } from '@mui/material'
import TextField from '@mui/material/TextField'

type SearchInputProps = {
  value?: string
  onChange: (newValue: string) => void
}

export const SearchInput = (props: SearchInputProps) => {
  const { value = '', onChange } = props
  return (
    <TextField
      value={value}
      onChange={(e) => {
        onChange(e.target.value || '')
      }}
      placeholder='Search'
      variant='outlined'
      size='small'
      slotProps={{
        input: {
          startAdornment: (
            <InputAdornment position='start'>
              <SearchIcon />
            </InputAdornment>
          ),
          endAdornment: value ? (
            <InputAdornment position='end'>
              <IconButton onClick={() => onChange('')}>
                <ClearIcon />
              </IconButton>
            </InputAdornment>
          ) : null,
        },
      }}
      sx={{
        // width: '100%',
        flexGrow: 1,
        '& .MuiInputBase-input': {
          padding: '6.5px 14px 7px 14px',
        },
      }}
    />
  )
}
