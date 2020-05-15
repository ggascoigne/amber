/* eslint-disable no-template-curly-in-string */
import * as Yup from 'yup'

// change the default error strings to something that doesn't list the field name
Yup.setLocale({
  mixed: {
    default: 'invalid',
    required: 'required',
    oneOf: 'must be one of the following values: ${values}',
  },
  string: {
    length: 'must be exactly ${length} characters',
    min: 'must be at least ${min} characters',
    max: 'must be at most ${max} characters',
    matches: 'must match the following: "${regex}"',
    email: 'must be a valid email',
    url: 'must be a valid URL',
    trim: 'must be a trimmed string',
    lowercase: 'must be a lowercase string',
    uppercase: 'must be a upper case string',
  },
  number: {
    min: 'must be greater than or equal to ${min}',
    max: 'must be less than or equal to ${max}',
    lessThan: 'must be less than ${less}',
    moreThan: 'must be greater than ${more}',
    positive: 'must be a positive number',
    negative: 'must be a negative number',
    integer: 'must be an integer',
  },
  date: {
    min: 'must be later than ${min}',
    max: 'must be at earlier than ${max}',
  },
})

export default Yup
