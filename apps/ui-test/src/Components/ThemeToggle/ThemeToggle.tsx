// import AutoModeIcon from '@mui/icons-material/AutoMode';
import { useCallback, useMemo } from 'react'

import BrightnessMediumIcon from '@mui/icons-material/BrightnessMedium'
import DarkModeIcon from '@mui/icons-material/DarkMode'
import LightModeIcon from '@mui/icons-material/LightMode'
import {
  Box,
  FormControlLabel,
  IconButton,
  Switch,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  useColorScheme,
} from '@mui/material'
import { useHotkeys } from 'react-hotkeys-hook'

type ColorSchemePreferences = 'light' | 'dark' | 'system'

const themeOptions = [
  {
    scheme: 'light',
    icon: <LightModeIcon />,
    title: 'Light mode',
    shortTitle: 'Light',
  },
  {
    scheme: 'dark',
    icon: <DarkModeIcon />,
    title: 'Dark mode',
    shortTitle: 'Dark',
  },
  {
    scheme: 'system',
    icon: <BrightnessMediumIcon />,
    title: 'Browser/OS default',
    shortTitle: 'System',
  },
] as const

type ThemeOptionsIndex = 0 | 1 | 2

const getIndex = (mode: ColorSchemePreferences | undefined) =>
  ((mode && themeOptions.findIndex((option) => option.scheme === mode)) as ThemeOptionsIndex) || 0

const getNext = (skipSystem: boolean, mode: ColorSchemePreferences | undefined) => {
  const validOptions = skipSystem ? themeOptions.length - 1 : themeOptions.length
  const old = getIndex(mode)
  return ((old + 1) % validOptions) as ThemeOptionsIndex
}

type ThemeToggleButtonProps = {
  skipSystem?: boolean
}

export const ThemeToggleButton = ({ skipSystem = true }: ThemeToggleButtonProps) => {
  const { mode, setMode } = useColorScheme()
  const nextIndex = getNext(skipSystem, mode)
  const switchTheme = useCallback(() => setMode(themeOptions[nextIndex].scheme), [nextIndex, setMode])

  useHotkeys('ctrl+t', switchTheme)

  return (
    <Tooltip title={`Switch to ${themeOptions[nextIndex].title}`}>
      <IconButton
        color='inherit'
        data-testid='color-scheme-toggle'
        aria-label='colorScheme'
        sx={{ height: 40, width: 40, pl: 1, pr: 1 }}
        onClick={switchTheme}
      >
        {themeOptions[getIndex(mode)].icon}
      </IconButton>
    </Tooltip>
  )
}

type ThemeToggleMenu1Props = {
  skipSystem?: boolean
}

export const ThemeToggleMenu1 = (_props: ThemeToggleMenu1Props) => {
  const { mode, setMode } = useColorScheme()

  return (
    <Box>
      <FormControlLabel
        value='Dark mode'
        control={
          <Switch
            color='primary'
            checked={mode === 'dark'}
            onChange={(event) => setMode(event.target.checked ? 'dark' : 'light')}
          />
        }
        label='Dark mode'
        labelPlacement='start'
      />
    </Box>
  )
}

type ThemeToggleMenu2Props = {
  skipSystem?: boolean
}

export const ThemeToggleMenu2 = ({ skipSystem = true }: ThemeToggleMenu2Props) => {
  const options = useMemo(
    () => (skipSystem ? themeOptions.filter((o) => o.scheme !== 'system') : themeOptions),
    [skipSystem],
  )

  const { mode, setMode } = useColorScheme()

  const handleChange = (_event: React.MouseEvent<HTMLElement>, newMode: 'light' | 'dark' | 'system' | null) => {
    setMode(newMode)
  }

  const control = {
    value: mode,
    onChange: handleChange,
    exclusive: true,
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
      }}
    >
      <ToggleButtonGroup sx={{ px: 1 }} {...control} size='small'>
        {options.map((o) => (
          <ToggleButton
            key={o.scheme}
            data-testid={`color-scheme-toggle-${o.scheme}`}
            value={o.scheme}
            sx={{
              display: 'flex',
              flexDirection: 'row',
            }}
          >
            {o.icon}
            <Box sx={{ pl: 1 }}>{o.shortTitle}</Box>
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
    </Box>
  )
}

type ThemeToggleProps = {
  skipSystem?: boolean
  variant?: 'button' | 'menu1' | 'menu2'
}

export const ThemeToggle = ({ skipSystem = true, variant = 'button' }: ThemeToggleProps) => {
  if (variant === 'button') {
    return <ThemeToggleButton skipSystem={skipSystem} />
  }
  if (variant === 'menu1') {
    return <ThemeToggleMenu1 skipSystem={skipSystem} />
  }
  return <ThemeToggleMenu2 skipSystem={skipSystem} />
}
