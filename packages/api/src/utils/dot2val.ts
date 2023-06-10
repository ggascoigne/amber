/* eslint-disable no-param-reassign, no-prototype-builtins */
// This is a typescript port of https://github.com/yangg/dot2val
// MIT licensed based upon the entry in the package.json

/*!
 * dot2val
 * Set or get a value within a deeply nested object using `dot' notation
 * @author Brook Yang https://github.com/yangg/dot2val
 */

// note that I'd be happy to use https://github.com/jonschlinkert/set-value/blob/master/index.js
// but it automatically assumes the numeric object keys go in arrays, and I don't want that here
// really should just submit a patch
export const setVal = (obj: any, path: string | string[], val: any) => {
  const parts = Array.isArray(path) ? path : path.split('.')
  let k = parts[0]
  if (parts.length > 1) {
    const partsLength = parts.length
    k = parts[partsLength - 1]

    for (let i = 0; i < partsLength - 1; i++) {
      const part = parts[i]
      if (!obj.hasOwnProperty(part)) {
        obj[part] = {}
      }
      obj = obj[part]
    }
  }
  if (typeof val === 'undefined') {
    delete obj[k]
  } else {
    obj[k] = val
  }
}
/**
 * retrieves a value from a deeply nested object using "dot" notation
 */
export const getVal = (obj: any, path: string | string[], def: any) => {
  const parts = Array.isArray(path) ? path : path.split('.')
  let k = parts[0]
  if (parts.length > 1) {
    const partsLength = parts.length
    k = parts[partsLength - 1]

    for (let i = 0; i < partsLength - 1; i++) {
      const part = parts[i]
      if (!obj.hasOwnProperty(part)) {
        obj = false
        break
      }
      obj = obj[part]
    }
  }
  return typeof obj?.[k] === 'undefined' ? def : obj[k]
}
