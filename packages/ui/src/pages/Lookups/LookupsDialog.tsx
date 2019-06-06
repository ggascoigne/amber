import { createLookup } from '__generated__/createLookup'
import { GetLookups_lookups_edges_node } from '__generated__/GetLookups'
import { updateLookupByNodeId } from '__generated__/updateLookupByNodeId'
import { Dialog, Theme, WithStyles } from '@material-ui/core'
import Button from '@material-ui/core/Button'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import IconButton from '@material-ui/core/IconButton'
import createStyles from '@material-ui/core/styles/createStyles'
import withStyles from '@material-ui/core/styles/withStyles'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Typography from '@material-ui/core/Typography'
import AddIcon from '@material-ui/icons/Add'
import DeleteIcon from '@material-ui/icons/Delete'
import { useCreateOrUpdateLookup, useCreateOrUpdateLookupValue, useDeleteLookupValue } from 'client/queries'
import { DialogTitle } from 'components/Acnw/Dialog/DialogTitle'
import Card from 'components/MaterialKitReact/Card/Card'
import CardBody from 'components/MaterialKitReact/Card/CardBody'
import CardHeader from 'components/MaterialKitReact/Card/CardHeader'
import GridContainer from 'components/MaterialKitReact/Grid/GridContainer'
import GridItem from 'components/MaterialKitReact/Grid/GridItem'
import { Field, FieldArray, Form, Formik, FormikActions } from 'formik'
import { TextField } from 'formik-material-ui'
import * as React from 'react'
import { MouseEventHandler } from 'react'
import * as Yup from 'yup'

const styles = (theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      marginTop: theme.spacing(3),
      overflowX: 'auto'
    },
    table: {
      minWidth: 700
    },
    header: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingLeft: 24,
      paddingRight: 24
    },
    title: {
      color: '#fff',
      fontWeight: 300,
      textTransform: 'none'
    },
    iconButton: {
      color: '#fff',
      '&:hover': {
        backgroundColor: 'rgba(255, 255, 255, 0.08)'
      }
    },
    addIcon: {},
    deleteIcon: {},
    deleteButton: {
      color: theme.palette.grey[500]
    }
  })

interface ILookupsDialog extends WithStyles<typeof styles> {
  open: boolean
  onClose: MouseEventHandler
  initialValues?: FormValues
}

interface FormValues extends Partial<GetLookups_lookups_edges_node> {}

const validationSchema = Yup.object().shape({
  realm: Yup.string()
    .min(2, 'Too Short!')
    .max(50, 'Too Long!')
    .required('Required'),
  lookupValues: Yup.object().shape({
    nodes: Yup.array().of(
      Yup.object().shape({
        sequencer: Yup.number().required('Required'),
        code: Yup.string()
          .min(2, 'Too Short!')
          .max(50, 'Too Long!')
          .required('Required'),
        value: Yup.string()
          .min(2, 'Too Short!')
          .max(50, 'Too Long!')
          .required('Required')
      })
    )
  })
})

const defaultValues: FormValues = { realm: '', lookupValues: { __typename: 'LookupValuesConnection', nodes: [] } }

export const _LookupsDialog: React.FC<ILookupsDialog> = ({ open, onClose, initialValues = defaultValues, classes }) => {
  const createOrUpdateLookup = useCreateOrUpdateLookup()
  const createOrUpdateLookupValue = useCreateOrUpdateLookupValue()
  const deleteLookupValue = useDeleteLookupValue()

  const onSubmit = async (values: FormValues, actions: FormikActions<FormValues>) => {
    const res = await createOrUpdateLookup(values)
    const isCreateLookup = (value: updateLookupByNodeId | createLookup): value is createLookup =>
      value.hasOwnProperty('createLookup')

    const lookupId = isCreateLookup(res.data)
      ? res.data.createLookup.lookup.id
      : res.data.updateLookupByNodeId.lookup.id

    const updaters: Promise<any>[] = values.lookupValues.nodes.map(lv => createOrUpdateLookupValue(lv, lookupId))

    const currentLookupValueIds = values.lookupValues.nodes.map(lv => lv.id)
    initialValues.lookupValues.nodes.map(
      ilv =>
        currentLookupValueIds.includes(ilv.id) ||
        updaters.push(deleteLookupValue({ variables: { input: { id: ilv.id } } }))
    )

    Promise.all(updaters)
      .then(() => onClose(null))
      .finally(() => actions.setSubmitting(false))
  }

  const editing = initialValues !== defaultValues

  const highestSequence = (values: FormValues) => {
    return values.lookupValues.nodes.reduce((acc, val) => Math.max(val.sequencer, acc), -1) + 1
  }

  return (
    <Dialog disableBackdropClick fullWidth={true} maxWidth={false} open={open} onClose={onClose}>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
        render={({ isSubmitting, values }) => (
          <Form>
            <DialogTitle onClose={onClose}>{editing ? 'Edit' : 'Add'} Lookup</DialogTitle>
            <DialogContent>
              <GridContainer spacing={40}>
                <GridItem xs={12} md={6}>
                  <Field name='realm' label='Realm' component={TextField} margin='normal' />
                </GridItem>
                <GridItem>
                  <FieldArray
                    name='lookupValues.nodes'
                    render={arrayHelpers => (
                      <Card>
                        <CardHeader color='success' className={classes.header}>
                          <Typography variant='h6' component='h2' className={classes.title}>
                            Lookup Values
                          </Typography>
                          <IconButton
                            className={classes.iconButton}
                            onClick={() =>
                              arrayHelpers.push({ sequencer: highestSequence(values), code: '', value: '' })
                            }
                          >
                            <AddIcon className={classes.addIcon} />
                          </IconButton>
                        </CardHeader>
                        <CardBody>
                          <Table className={classes.table}>
                            <TableHead>
                              <TableRow>
                                <TableCell>Sequencer</TableCell>
                                <TableCell>Code</TableCell>
                                <TableCell>Value</TableCell>
                                <TableCell>&nbsp;</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {values.lookupValues.nodes.map((lv, index) => (
                                <TableRow key={index}>
                                  <TableCell component='th' scope='row' style={{ width: '10%' }}>
                                    <Field
                                      name={`lookupValues.nodes[${index}].sequencer`}
                                      component={TextField}
                                      fullWidth
                                      type='number'
                                    />
                                  </TableCell>
                                  <TableCell style={{ width: '20%' }}>
                                    <Field name={`lookupValues.nodes[${index}].code`} component={TextField} fullWidth />
                                  </TableCell>
                                  <TableCell>
                                    <Field
                                      name={`lookupValues.nodes[${index}].value`}
                                      component={TextField}
                                      fullWidth
                                    />
                                  </TableCell>
                                  <TableCell align='right' style={{ width: '50px' }}>
                                    <IconButton
                                      className={classes.deleteButton}
                                      onClick={() => arrayHelpers.remove(index)}
                                    >
                                      <DeleteIcon className={classes.deleteIcon} />
                                    </IconButton>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </CardBody>
                      </Card>
                    )}
                  />
                </GridItem>
              </GridContainer>
            </DialogContent>
            <DialogActions className={'modalFooterButtons'}>
              <Button onClick={onClose} variant='outlined'>
                Cancel
              </Button>
              <Button disabled={isSubmitting} type='submit' variant='contained' color='primary'>
                Save
              </Button>
            </DialogActions>
          </Form>
        )}
      />
    </Dialog>
  )
}

export const LookupsDialog = withStyles(styles)(_LookupsDialog)
