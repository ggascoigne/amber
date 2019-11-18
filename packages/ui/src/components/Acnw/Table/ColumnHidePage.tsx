import { Checkbox, FormControlLabel, Popover, Typography, createStyles, makeStyles } from '@material-ui/core'
import React, { ReactElement } from 'react'
import { TableInstance } from 'react-table'

const useStyles = makeStyles(
  createStyles({
    columnsPopOver: {
      '& > div': {
        padding: '24px 8px 24px 24px'
      }
    },
    popoverTitle: {
      fontWeight: 500,
      padding: '0 24px 24px 0',
      textTransform: 'uppercase'
    }
  })
)

type ColumnHidePage<T extends object> = {
  instance: TableInstance<T>
  anchorEl?: Element
  onClose: () => void
  show: boolean
}

export function ColumnHidePage<T extends object>({
  instance,
  anchorEl,
  onClose,
  show
}: ColumnHidePage<T>): ReactElement {
  const classes = useStyles({})
  const { columns, setColumnHidden } = instance
  const filterableColumns = columns.filter(column => !(column.id === '_selector' || column.id === '_action'))
  const checkedCount = filterableColumns.reduce((acc, val) => acc + (val.isVisible ? 0 : 1), 0)

  const onlyOneOptionLeft = checkedCount + 1 >= filterableColumns.length

  return (
    <div>
      <Popover
        anchorEl={anchorEl}
        className={classes.columnsPopOver}
        id={'popover-column-hide'}
        onClose={onClose}
        open={show}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
      >
        <Typography className={classes.popoverTitle}>Visible Columns</Typography>
        {filterableColumns.map(column => {
          return (
            <span key={column.id}>
              <FormControlLabel
                control={<Checkbox value={`${column.id}`} disabled={column.isVisible && onlyOneOptionLeft} />}
                label={column.render('Header')}
                checked={column.isVisible}
                onChange={() => setColumnHidden(column.id, column.isVisible)}
              />
              <br />
            </span>
          )
        })}
      </Popover>
    </div>
  )
}
