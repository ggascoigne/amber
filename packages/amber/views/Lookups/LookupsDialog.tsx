import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import { IconButton, Table, TableBody, TableCell, TableHead, TableRow, Theme, Typography } from '@mui/material'
import { FieldArray, FormikHelpers } from 'formik'
import React from 'react'
import { makeStyles } from 'tss-react/mui'
import Yup from 'ui/utils/Yup'

import { Card, CardBody, CardHeader, EditDialog, GridContainer, GridItem, TextField, ToFormValues } from 'ui'
import {
  CreateLookupMutation,
  useCreateLookupMutation,
  useCreateLookupValueMutation,
  useDeleteLookupValueMutation,
  useUpdateLookupByNodeIdMutation,
  useUpdateLookupValueByNodeIdMutation,
} from '../../client'
import { LookupAndValues } from './Lookups'

const useStyles = makeStyles()((theme: Theme) => ({
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
}))

type LookupAndValuesType = ToFormValues<LookupAndValues>

interface LookupsDialogProps {
  open: boolean
  onClose: (event?: any) => void
  initialValues?: LookupAndValuesType
}

const validationSchema = Yup.object().shape({
  realm: Yup.string().min(2).max(50).required('Required'),
  lookupValues: Yup.object().shape({
    nodes: Yup.array().of(
      Yup.object().shape({
        sequencer: Yup.number().required(),
        code: Yup.string().min(2).max(50).required(),
        value: Yup.string().min(2).max(255).required(),
      })
    ),
  }),
})

const defaultValues: LookupAndValuesType = {
  realm: '',
  lookupValues: { __typename: 'LookupValuesConnection', nodes: [] },
}

export const LookupsDialog: React.FC<LookupsDialogProps> = ({ open, onClose, initialValues = defaultValues }) => {
  const { classes } = useStyles()
  const createLookup = useCreateLookupMutation()
  const updateLookup = useUpdateLookupByNodeIdMutation()
  const createLookupValue = useCreateLookupValueMutation()
  const updateLookupValue = useUpdateLookupValueByNodeIdMutation()
  const deleteLookupValue = useDeleteLookupValueMutation()

  const onSubmit = async (values: LookupAndValuesType, actions: FormikHelpers<LookupAndValuesType>) => {
    const res = values.nodeId
      ? await updateLookup.mutateAsync({
          input: {
            nodeId: values.nodeId,
            patch: {
              realm: values.realm,
            },
          },
        })
      : await createLookup.mutateAsync({
          input: {
            lookup: {
              realm: values.realm,
              codeType: 'string',
              internationalize: false,
              valueType: 'string',
              ordering: 'sequencer',
            },
          },
        })

    // eslint-disable-next-line no-prototype-builtins
    const isCreateLookup = (value: typeof res): value is CreateLookupMutation => value.hasOwnProperty('createLookup')

    if (!res) {
      return
    }
    if (isCreateLookup(res) && !res.createLookup) {
      return
    }
    if (!isCreateLookup(res) && !res.updateLookupByNodeId) {
      return
    }

    const lookupId = isCreateLookup(res) ? res.createLookup?.lookup?.id : res.updateLookupByNodeId?.lookup?.id

    const updaters = values.lookupValues.nodes.reduce((acc: Promise<any>[], lv) => {
      if (lv) {
        if (lv.nodeId) {
          acc.push(
            updateLookupValue.mutateAsync({
              input: {
                nodeId: lv.nodeId,
                patch: {
                  code: lv.code,
                  sequencer: lv.sequencer,
                  value: lv.value,
                  lookupId,
                },
              },
            })
          )
        } else {
          acc.push(
            createLookupValue.mutateAsync({
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
            })
          )
        }
      }
      return acc
    }, [])

    const currentLookupValueIds = values.lookupValues.nodes.reduce((acc: number[], lv) => {
      lv?.id && acc.push(lv.id)
      return acc
    }, [])

    initialValues.lookupValues.nodes.map((ilv) => {
      if (ilv?.id) {
        currentLookupValueIds.includes(ilv.id) ||
          updaters.push(deleteLookupValue.mutateAsync({ input: { id: ilv.id } }))
      }
      return null
    })

    Promise.allSettled(updaters).then(() => {
      actions.setSubmitting(false)
      onClose(null)
    })
  }

  const highestSequence = (values: LookupAndValuesType) =>
    values.lookupValues.nodes.reduce((acc, val) => Math.max(val ? val.sequencer : 0, acc), -1) + 1

  return (
    <EditDialog
      initialValues={initialValues}
      onClose={onClose}
      open={open}
      onSubmit={onSubmit}
      title='Lookup'
      validationSchema={validationSchema}
      isEditing={initialValues !== defaultValues}
    >
      {(formikProps) => (
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
                        arrayHelpers.push({ sequencer: highestSequence(formikProps.values), code: '', value: '' })
                      }
                      size='large'
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
                        {formikProps.values.lookupValues.nodes.map((lv, index) => (
                          <TableRow key={index}>
                            <TableCell scope='row' style={{ width: '10%' }}>
                              <TextField name={`lookupValues.nodes[${index}].sequencer`} fullWidth type='number' />
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
                                size='large'
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
      )}
    </EditDialog>
  )
}
