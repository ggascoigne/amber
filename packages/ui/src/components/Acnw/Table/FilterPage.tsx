import { Button, FormControl, Popover, Typography, createStyles, makeStyles } from '@material-ui/core'
import classNames from 'classnames'
import { Form, Formik, FormikHelpers, FormikState } from 'formik'
import React, { ReactElement, useCallback, useMemo } from 'react'
import { ColumnInstance, Filters, IdType, TableInstance } from 'react-table'

import { TextField } from '../Form'

const useStyles = makeStyles(
  createStyles({
    columnsPopOver: {
      '& > div': {
        padding: '24px 8px 5px 24px'
      }
    },
    filtersClearButton: {
      position: 'absolute',
      top: 18,
      right: 21
    },
    popoverTitle: {
      fontWeight: 500,
      padding: '0 24px 24px 0',
      textTransform: 'uppercase'
    },
    formGrid: {
      flex: '1 1 calc(50% - 24px)',
      marginRight: 24,
      marginBottom: 24,
      width: 218,
      '@media (max-width: 600px)': {
        width: 150
      }
    },
    margin: {},
    formControl: {}
  })
)

type FilterPage<T extends object> = {
  instance: TableInstance<T>
  anchorEl?: Element
  onClose: () => void
  show: boolean
}

const id = 'popover-filters'

// you get an error from react if you initialize an input with an undefined initial value since that causes it to be uncontrolled
// then it becomes controlled as soon as it gets a value.  So initialize the non-existent values with an empty string.
const getFormSafeValues = <T extends {}>(columns: ColumnInstance<T>[], filters: Filters<T>) =>
  columns
    .filter(it => it.canFilter)
    .reduce((old, val) => Object.assign(old, { [val.id]: filters[val.id] || '' }), {} as Filters<T>)

export function FilterPage<T extends object>({ instance, anchorEl, onClose, show }: FilterPage<T>): ReactElement {
  const classes = useStyles({})
  const {
    columns,
    setAllFilters,
    state: { filters }
  } = instance

  const initialValues = useMemo(() => {
    return getFormSafeValues(columns, filters)
  }, [columns, filters])

  const onSubmit = (values: Filters<T>, { setSubmitting }: FormikHelpers<Filters<T>>) => {
    // note that setAllFilters modified values and removes all empty strings causing warnings from react
    setAllFilters({ ...values })
    setSubmitting(false)
    onClose()
  }

  const onBlur = useCallback(
    (values: Filters<T>) => {
      setAllFilters({ ...values })
    },
    [setAllFilters]
  )

  const resetFilters = (resetForm: (nextState?: Partial<FormikState<Filters<T>>>) => void) => {
    return () => {
      setAllFilters({} as Record<IdType<T>, any>)
      resetForm({
        values: getFormSafeValues(columns, {} as Record<IdType<T>, any>)
      })
    }
  }

  return (
    <div>
      <Popover
        anchorEl={anchorEl}
        className={classes.columnsPopOver}
        id={id}
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
        <Typography className={classes.popoverTitle}>Filters</Typography>
        <Formik onSubmit={onSubmit} initialValues={initialValues}>
          {({ values, resetForm }) => (
            <Form>
              <Button
                className={classNames(classes.margin, classes.filtersClearButton)}
                color='primary'
                onClick={resetFilters(resetForm)}
              >
                Reset
              </Button>
              {columns
                .filter(it => it.canFilter)
                .map((column, index) => {
                  return (
                    <span key={column.id}>
                      <FormControl className={classNames(classes.formControl, classes.formGrid)}>
                        <TextField
                          name={column.id}
                          overrideFormik={true}
                          autoFocus={index === 0}
                          variant={'standard'}
                          // note that this relies on a convention of having the columns header component just render the name
                          label={column.render('Header')}
                          onBlur={() => onBlur(values)}
                        />
                      </FormControl>
                      {Math.abs(index % 2) === 1 ? <br /> : null}
                    </span>
                  )
                })}
              <Button
                style={{
                  display: 'none'
                }}
                type={'submit'}
              >
                &nbsp;
              </Button>
            </Form>
          )}
        </Formik>
      </Popover>
    </div>
  )
}
