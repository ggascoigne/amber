import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Theme,
  Typography,
  createStyles,
  makeStyles,
  useTheme,
} from '@material-ui/core'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import AddIcon from '@material-ui/icons/Add'
import DeleteIcon from '@material-ui/icons/Delete'
import { DialogTitle, GridContainer, GridItem, TextField } from 'components/Acnw'
import Card from 'components/MaterialKitReact/Card/Card'
import CardBody from 'components/MaterialKitReact/Card/CardBody'
import CardHeader from 'components/MaterialKitReact/Card/CardHeader'
import { FieldArray, Form, Formik, FormikHelpers } from 'formik'
import * as React from 'react'
import Yup from 'utils/Yup'

import {
  CreateLookupMutation,
  Node,
  useCreateLookupMutation,
  useCreateLookupValueMutation,
  useDeleteLookupValueMutation,
  useUpdateLookupByNodeIdMutation,
  useUpdateLookupValueByNodeIdMutation,
} from '../../client'
import type { LookupAndValues } from './types'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      marginTop: theme.spacing(3),
      overflowX: 'auto',
    },
    table: {
      minWidth: 700,
    },
    header: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingLeft: 24,
      paddingRight: 24,
    },
    title: {
      color: '#fff',
      fontWeight: 300,
      textTransform: 'none',
    },
    iconButton: {
      color: '#fff',
      '&:hover': {
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
      },
    },
    addIcon: {},
    deleteIcon: {},
    deleteButton: {
      color: theme.palette.grey[500],
    },
  })
)

type FormValues = Omit<LookupAndValues, 'nodeId' | 'id' | '__typename'> & Partial<Node>

interface LookupsDialogProps {
  open: boolean
  onClose: (event?: any) => void
  initialValues?: FormValues
}

const validationSchema = Yup.object().shape({
  realm: Yup.string().min(2).max(50).required('Required'),
  lookupValues: Yup.object().shape({
    nodes: Yup.array().of(
      Yup.object().shape({
        sequencer: Yup.number().required(),
        code: Yup.string().min(2).max(50).required(),
        value: Yup.string().min(2).max(50).required(),
      })
    ),
  }),
})

const defaultValues: FormValues = { realm: '', lookupValues: { __typename: 'LookupValuesConnection', nodes: [] } }

export const LookupsDialog: React.FC<LookupsDialogProps> = ({ open, onClose, initialValues = defaultValues }) => {
  const classes = useStyles()
  const [createLookup] = useCreateLookupMutation()
  const [updateLookup] = useUpdateLookupByNodeIdMutation()
  const [createLookupValue] = useCreateLookupValueMutation()
  const [updateLookupValue] = useUpdateLookupValueByNodeIdMutation()
  const [deleteLookupValue] = useDeleteLookupValueMutation()
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'))

  const onSubmit = async (values: FormValues, actions: FormikHelpers<FormValues>) => {
    const res = values.nodeId
      ? await updateLookup({
          variables: {
            input: {
              nodeId: values.nodeId!,
              patch: {
                realm: values.realm,
              },
            },
          },
        })
      : await createLookup({
          variables: {
            input: {
              lookup: {
                realm: values.realm,
                codeType: 'string',
                internationalize: false,
                valueType: 'string',
                ordering: 'sequencer',
              },
            },
          },
        })

    const isCreateLookup = (value: typeof res.data): value is CreateLookupMutation =>
      value!.hasOwnProperty('createLookup')

    if (!res || !res.data) {
      return
    }
    if (isCreateLookup(res.data) && !res.data.createLookup) {
      return
    }
    if (!isCreateLookup(res.data) && !res.data.updateLookupByNodeId) {
      return
    }

    const lookupId = isCreateLookup(res.data)
      ? res?.data?.createLookup?.lookup?.id
      : res?.data?.updateLookupByNodeId?.lookup?.id

    const updaters = values.lookupValues.nodes.reduce((acc: Promise<any>[], lv) => {
      if (lv) {
        if (lv.nodeId) {
          acc.push(
            updateLookupValue({
              variables: {
                input: {
                  nodeId: lv.nodeId,
                  patch: {
                    code: lv.code,
                    sequencer: lv.sequencer,
                    value: lv.value,
                    lookupId,
                  },
                },
              },
            })
          )
        } else {
          acc.push(
            createLookupValue({
              variables: {
                input: {
                  lookupValue: {
                    code: lv.code,
                    sequencer: lv.sequencer,
                    value: lv.value,
                    lookupId: lookupId!,
                    numericSequencer: 0.0,
                    stringSequencer: '_',
                  },
                },
              },
            })
          )
        }
      }
      return acc
    }, [])

    const currentLookupValueIds = values.lookupValues.nodes.reduce((acc: number[], lv) => {
      lv && lv.id && acc.push(lv.id)
      return acc
    }, [])

    initialValues.lookupValues.nodes.map((ilv) => {
      if (ilv && ilv.id) {
        currentLookupValueIds.includes(ilv.id) ||
          updaters.push(deleteLookupValue({ variables: { input: { id: ilv.id } } }))
      }
      return null
    })

    Promise.allSettled(updaters).then(() => {
      actions.setSubmitting(false)
      onClose(null)
    })
  }

  const editing = initialValues !== defaultValues

  const highestSequence = (values: FormValues) =>
    values.lookupValues.nodes.reduce((acc, val) => Math.max(val ? val.sequencer : 0, acc), -1) + 1

  return (
    <Dialog disableBackdropClick fullWidth maxWidth={false} open={open} onClose={onClose} fullScreen={fullScreen}>
      <Formik initialValues={initialValues} enableReinitialize validationSchema={validationSchema} onSubmit={onSubmit}>
        {({ isSubmitting, values }) => (
          <Form>
            <DialogTitle onClose={onClose}>{editing ? 'Edit' : 'Add'} Lookup</DialogTitle>
            <DialogContent>
              <GridContainer spacing={5}>
                <GridItem xs={12} md={6}>
                  <TextField name='realm' label='Realm' margin='normal' />
                </GridItem>
                <GridItem>
                  <FieldArray
                    name='lookupValues.nodes'
                    render={(arrayHelpers) => (
                      <Card>
                        <CardHeader color='success' className={classes.header}>
                          <Typography variant='h6' className={classes.title}>
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
                                  <TableCell scope='row' style={{ width: '10%' }}>
                                    <TextField
                                      name={`lookupValues.nodes[${index}].sequencer`}
                                      fullWidth
                                      type='number'
                                    />
                                  </TableCell>
                                  <TableCell style={{ width: '20%' }}>
                                    <TextField name={`lookupValues.nodes[${index}].code`} fullWidth />
                                  </TableCell>
                                  <TableCell>
                                    <TextField name={`lookupValues.nodes[${index}].value`} fullWidth />
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
            <DialogActions className='modalFooterButtons'>
              <Button onClick={onClose} variant='outlined'>
                Cancel
              </Button>
              <Button disabled={isSubmitting} type='submit' variant='contained' color='primary'>
                Save
              </Button>
            </DialogActions>
          </Form>
        )}
      </Formik>
    </Dialog>
  )
}
