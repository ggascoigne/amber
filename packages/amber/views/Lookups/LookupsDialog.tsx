import type React from 'react'

import { useInvalidateLookupQueries, useTRPC, type Lookup } from '@amber/client'
import type { ToFormValues } from '@amber/ui'
import { Card, CardBody, CardHeader, EditDialog, GridContainer, GridItem, TextField } from '@amber/ui'
import Yup from '@amber/ui/utils/Yup'
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import { IconButton, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material'
import { useMutation } from '@tanstack/react-query'
import type { FormikHelpers } from 'formik'
import { FieldArray } from 'formik'

type LookupFormType = ToFormValues<Lookup>

interface LookupsDialogProps {
  open: boolean
  onClose: (event?: any) => void
  initialValues?: LookupFormType
}

const validationSchema = Yup.object().shape({
  realm: Yup.string().min(2).max(50).required('Required'),
  lookupValues: Yup.object().shape({
    nodes: Yup.array().of(
      Yup.object().shape({
        sequencer: Yup.number().required(),
        code: Yup.string().min(2).max(50).required(),
        value: Yup.string().min(2).max(255).required(),
      }),
    ),
  }),
})

const defaultValues: LookupFormType = {
  realm: '',
  lookupValue: [],

  codeMaximum: null,
  codeMinimum: null,
  codeScale: null,
  codeType: 'string',
  internationalize: false,
  ordering: 'sequencer',
  valueMaximum: null,
  valueMinimum: null,
  valueScale: null,
  valueType: 'string',
}

export const LookupsDialog: React.FC<LookupsDialogProps> = ({ open, onClose, initialValues = defaultValues }) => {
  const trpc = useTRPC()

  const createLookup = useMutation(trpc.lookups.createLookup.mutationOptions())
  const updateLookup = useMutation(trpc.lookups.updateLookup.mutationOptions())
  const createLookupValue = useMutation(trpc.lookups.createLookupValue.mutationOptions())
  const updateLookupValue = useMutation(trpc.lookups.updateLookupValue.mutationOptions())
  const deleteLookupValue = useMutation(trpc.lookups.deleteLookupValue.mutationOptions())

  const invalidateQueries = useInvalidateLookupQueries()

  const onSubmit = async (values: LookupFormType, actions: FormikHelpers<LookupFormType>) => {
    const res = values.id
      ? await updateLookup.mutateAsync({
          id: values.id,
          realm: values.realm,
        })
      : await createLookup.mutateAsync({
          realm: values.realm,
        })

    if (!res) {
      return
    }
    const lookupId = res.lookup?.id

    const updaters = values.lookupValue.reduce((acc: Promise<any>[], lv) => {
      if (lv) {
        if (lv.id) {
          acc.push(
            updateLookupValue.mutateAsync({
              id: lv.id,
              code: lv.code,
              sequencer: lv.sequencer,
              value: lv.value,
            }),
          )
        } else {
          acc.push(
            createLookupValue.mutateAsync({
              code: lv.code,
              sequencer: lv.sequencer,
              value: lv.value,
              lookupId: lookupId!,
            }),
          )
        }
      }
      return acc
    }, [])

    const currentLookupValueIds = values.lookupValue.reduce((acc: number[], lv) => {
      lv?.id && acc.push(lv.id)
      return acc
    }, [])

    initialValues.lookupValue.map((ilv) => {
      if (ilv?.id) {
        currentLookupValueIds.includes(ilv.id) || updaters.push(deleteLookupValue.mutateAsync({ id: ilv.id }))
      }
      return null
    })

    Promise.allSettled(updaters).then(() => {
      actions.setSubmitting(false)
      invalidateQueries()
      onClose(null)
    })
  }

  const highestSequence = (values: LookupFormType) =>
    values.lookupValue.reduce((acc, val) => Math.max(val ? val.sequencer : 0, acc), -1) + 1

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
          <GridItem size={{ xs: 12, md: 6 }}>
            <TextField name='realm' label='Realm' margin='normal' />
          </GridItem>
          <GridItem>
            <FieldArray
              name='lookupValue'
              render={(arrayHelpers) => (
                <Card>
                  <CardHeader
                    color='success'
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      px: 3,
                    }}
                  >
                    <Typography
                      variant='h6'
                      sx={{
                        color: '#fff',
                        fontWeight: 300,
                        textTransform: 'none',
                      }}
                    >
                      Lookup Values
                    </Typography>
                    <IconButton
                      sx={{
                        color: '#fff',
                        '&:hover': {
                          backgroundColor: 'rgba(255, 255, 255, 0.08)',
                        },
                      }}
                      onClick={() =>
                        arrayHelpers.push({
                          sequencer: highestSequence(formikProps.values),
                          code: '',
                          value: '',
                        })
                      }
                      size='large'
                    >
                      <AddIcon />
                    </IconButton>
                  </CardHeader>
                  <CardBody>
                    <Table sx={{ minWidth: 700 }}>
                      <TableHead>
                        <TableRow>
                          <TableCell>Sequencer</TableCell>
                          <TableCell>Code</TableCell>
                          <TableCell>Value</TableCell>
                          <TableCell>&nbsp;</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {formikProps.values.lookupValue.map((lv, index) => (
                          <TableRow key={index}>
                            <TableCell scope='row' style={{ width: '10%' }}>
                              <TextField name={`lookupValue[${index}].sequencer`} fullWidth type='number' />
                            </TableCell>
                            <TableCell style={{ width: '20%' }}>
                              <TextField name={`lookupValue[${index}].code`} fullWidth />
                            </TableCell>
                            <TableCell>
                              <TextField name={`lookupValue[${index}].value`} fullWidth />
                            </TableCell>
                            <TableCell align='right' style={{ width: '50px' }}>
                              <IconButton
                                sx={{
                                  color: (theme) => theme.palette.grey[500],
                                }}
                                onClick={() => arrayHelpers.remove(index)}
                                size='large'
                              >
                                <DeleteIcon />
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
