import Yup from 'utils/Yup'

// note not exported as part of the rest of the folder since that seems to cause too issues

export const profileValidationSchema = Yup.object().shape({
  firstName: Yup.string().min(2).max(20).required('Required'),
  lastName: Yup.string().min(2).max(40).required('Required'),
  fullName: Yup.string().min(2).max(64).required('Required'),
  email: Yup.string().min(2).max(64).required('Required'),
  profiles: Yup.object().shape({
    nodes: Yup.array().of(
      Yup.object().shape({
        snailMailAddress: Yup.string().min(2).max(250).required('Required'),
        phoneNumber: Yup.string().min(2).max(32).required('Required'),
      })
    ),
  }),
})
