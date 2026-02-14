import Yup from '@amber/ui/utils/Yup'
import {} from 'yup'

export const transactionValidationSchema = Yup.object().shape({
  amount: Yup.number().required('Required'),
  year: Yup.number().min(2022).required('Required'),
  notes: Yup.string().min(2).max(1024),
  data: Yup.object(),
})
