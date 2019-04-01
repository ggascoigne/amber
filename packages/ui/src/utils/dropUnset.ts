import identity from 'lodash/identity'
import pickBy from 'lodash/pickBy'

export const dropUnset = (val: any) => pickBy(val, identity)
