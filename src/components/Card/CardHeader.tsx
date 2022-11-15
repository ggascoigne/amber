import { Theme } from '@mui/material'
import React, { PropsWithChildren } from 'react'
import { makeStyles } from 'tss-react/mui'

const useStyles = makeStyles()((theme: Theme) => ({
  cardHeader: {
    borderRadius: '3px',
    padding: '1rem 15px',
    marginLeft: '15px',
    marginRight: '15px',
    marginTop: '-30px',
    border: '0',
    marginBottom: '0',
  },
  cardHeaderPlain: {
    marginLeft: '0px',
    marginRight: '0px',
  },
  warningCardHeader: {
    color: '#fff',
    background: `linear-gradient(60deg, ${theme.palette.warning.light}, ${theme.palette.warning.main})`,
    boxShadow: theme.mixins.boxShadow.warning,
  },
  successCardHeader: {
    color: '#fff',
    background: `linear-gradient(60deg, ${theme.palette.success.light}, ${theme.palette.success.main})`,
    boxShadow: theme.mixins.boxShadow.success,
  },
  errorCardHeader: {
    color: '#fff',
    background: `linear-gradient(60deg, ${theme.palette.error.light}, ${theme.palette.error.main})`,
    boxShadow: theme.mixins.boxShadow.error,
  },
  infoCardHeader: {
    color: '#fff',
    background: `linear-gradient(60deg, ${theme.palette.info.light}, ${theme.palette.info.main})`,
    boxShadow: theme.mixins.boxShadow.info,
  },
  primaryCardHeader: {
    color: '#fff',
    background: `linear-gradient(60deg, ${theme.palette.primary.light}, ${theme.palette.primary.main})`,
    boxShadow: theme.mixins.boxShadow.primary,
  },
}))
type ColorTypes = 'warning' | 'success' | 'error' | 'info' | 'primary'

interface CardHeaderProps {
  className?: string
  color?: ColorTypes
  plain?: boolean
}

export const CardHeader: React.FC<PropsWithChildren<CardHeaderProps>> = (props) => {
  const { classes, cx } = useStyles()
  const { className, children, color, plain, ...rest } = props
  const cardHeaderClasses = cx(
    classes.cardHeader,
    {
      [classes.warningCardHeader]: color === 'warning',
      [classes.successCardHeader]: color === 'success',
      [classes.errorCardHeader]: color === 'error',
      [classes.infoCardHeader]: color === 'info',
      [classes.primaryCardHeader]: color === 'primary',
      // [getKeyValue(classes)((color + 'CardHeader') as keyof typeof classes)]: color,
      [classes.cardHeaderPlain]: plain,
    },
    className
  )
  return (
    <div className={cardHeaderClasses} {...rest}>
      {children}
    </div>
  )
}
