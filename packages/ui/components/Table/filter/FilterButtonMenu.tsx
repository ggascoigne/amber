import type { ReactNode, MouseEvent, ForwardedRef } from 'react'
import { useCallback, useState, useRef, forwardRef, useEffect } from 'react'

import { ArrowDropDown as ArrowDropDownIcon } from '@mui/icons-material'
import { Button, Popover } from '@mui/material'
import type { ButtonProps } from '@mui/material/Button'
import { styled } from '@mui/material/styles'
import clsx from 'clsx'

const FilterButtonImpl = styled(Button)(({ theme }) => ({
  minWidth: 'auto',
  color: theme.palette.text.primary,
  borderRadius: theme.shape.borderRadius,
  borderColor: theme.palette.mode === 'light' ? 'rgba(0, 0, 0, 0.23)' : 'rgba(255, 255, 255, 0.23)',
  borderStyle: 'solid',
  borderWidth: '1px',
  padding: theme.spacing(0.5, 1),
  backgroundColor: theme.palette.background.paper,
  boxShadow: 'none',
  textTransform: 'none',
  fontSize: '0.875rem',
  lineHeight: 1.5,
  minHeight: `calc(26px + ${theme.spacing(1)})`, // 24 is the height of the non-button content, the extra 2px is the border
  '&:hover': {
    backgroundColor: theme.palette.background.paper,
    borderColor: theme.palette.text.primary,
  },
  '&:focus, &.open': {
    borderColor: theme.palette.primary.main,
    // TODO: would like this to work, but need to find a way to do so without causing the button to shift
    // looks like mui does this by using an InputWrapper with a manual style
    // look at the code for https://mui.com/material-ui/react-autocomplete/#customized-hook
    // borderWidth: 2,
  },
})) as typeof Button

const FilterButton = forwardRef((props: ButtonProps, ref: ForwardedRef<any>) => (
  <FilterButtonImpl ref={ref} {...props} />
))

export type FilterButtonMenuChildRenderProps = {
  closePopup: (reason?: any) => void
}

type FilterButtonMenuChildren = {
  renderChildren?: undefined
  children: ReactNode
}
type FilterButtonMenuRenderChildren = {
  renderChildren: (props: FilterButtonMenuChildRenderProps) => ReactNode
  children?: undefined
}

export type FilterButtonMenuProps = {
  title: ReactNode
  onLoseFocus?: () => void
  autoOpen?: boolean
} & (FilterButtonMenuChildren | FilterButtonMenuRenderChildren)

export const FilterButtonMenu = ({
  title,
  renderChildren,
  children,
  onLoseFocus,
  autoOpen = false,
}: FilterButtonMenuProps) => {
  const ref = useRef<HTMLButtonElement>(undefined)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const handleButtonClick = useCallback((event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }, [])

  useEffect(() => {
    if (ref.current && autoOpen) {
      setAnchorEl(ref.current)
    }
  }, [autoOpen])

  const closePopup = useCallback(
    (reason?: any) => {
      if (reason?.type === 'click' || (reason?.type === 'keydown' && reason?.code === 'Escape')) {
        onLoseFocus?.()
      }
      setAnchorEl(null)
    },
    [onLoseFocus],
  )

  return (
    <>
      <FilterButton
        ref={ref}
        variant='outlined'
        endIcon={
          <ArrowDropDownIcon
            sx={{
              transform: anchorEl ? 'rotate(180deg)' : undefined,
              transition: (theme) =>
                `transform ${theme.transitions.duration.shorter}ms ${theme.transitions.easing.easeInOut} 0ms`,
            }}
          />
        }
        disableRipple
        onClick={handleButtonClick}
        className={clsx({ open: !!anchorEl })}
      >
        {title}
      </FilterButton>
      <Popover
        anchorEl={anchorEl}
        onClose={closePopup}
        open={!!anchorEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        slotProps={{
          paper: {
            variant: 'elevation',
            elevation: 5,
          },
        }}
        elevation={0}
      >
        {children}
        {renderChildren?.({ closePopup })}
      </Popover>
    </>
  )
}
