import identity from 'lodash/identity'
import pickBy from 'lodash/pickBy'

export const dropUnset = val => pickBy(val, identity)
