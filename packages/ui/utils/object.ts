/* eslint-disable no-param-reassign */

// copied then trimmed from https://raw.githubusercontent.com/auth0/auth0.js/master/src/helper/object.js

function camelToSnake(str: string) {
  let newKey = ''
  let index = 0
  let code
  let wasPrevNumber = true
  let wasPrevUppercase = true

  while (index < str.length) {
    code = str.charCodeAt(index)
    if ((!wasPrevUppercase && code >= 65 && code <= 90) || (!wasPrevNumber && code >= 48 && code <= 57)) {
      newKey += '_'
      newKey += str[index]?.toLowerCase()
    } else {
      newKey += str[index]?.toLowerCase()
    }
    wasPrevNumber = code >= 48 && code <= 57
    wasPrevUppercase = code >= 65 && code <= 90
    index += 1
  }

  return newKey
}

function snakeToCamel(str: string) {
  const parts = str.split('_')
  return parts.reduce((p, c) => p + c.charAt(0).toUpperCase() + c.slice(1), parts.shift()!)
}

export function toSnakeCase(object: any, exceptions: string[] = []) {
  if (typeof object !== 'object' || object === null) {
    return object
  }

  return Object.keys(object).reduce((p: Record<string, any>, key: string) => {
    const newKey = exceptions.indexOf(key) === -1 ? camelToSnake(key) : key
    p[newKey] = toSnakeCase(object[key])
    return p
  }, {})
}

export function toCamelCase(object: any, exceptions: string[] = []) {
  if (typeof object !== 'object' || object === null) {
    return object
  }

  return Object.keys(object).reduce((p: Record<string, any>, key: string) => {
    const newKey = exceptions.indexOf(key) === -1 ? snakeToCamel(key) : key
    p[newKey] = toCamelCase(object[key])
    return p
  }, {})
}

export function camelToWords(str: string) {
  let newKey = ''
  let index = 0
  let code
  let wasPrevNumber = true
  let wasPrevUppercase = true

  while (index < str.length) {
    code = str.charCodeAt(index)
    if (index === 0) {
      newKey += str[index]?.toUpperCase()
    } else if ((!wasPrevUppercase && code >= 65 && code <= 90) || (!wasPrevNumber && code >= 48 && code <= 57)) {
      newKey += ' '
      newKey += str[index]?.toUpperCase()
    } else {
      newKey += str[index]?.toLowerCase()
    }
    wasPrevNumber = code >= 48 && code <= 57
    wasPrevUppercase = code >= 65 && code <= 90
    index += 1
  }

  return newKey
}

export const not = <T>(a: T[], b: T[]) => a.filter((value) => b.indexOf(value) === -1)

export const intersection = <T>(a: T[], b: T[]) => a.filter((value) => b.indexOf(value) !== -1)

export const union = <T>(a: T[], b: T[]) => [...a, ...not(b, a)]

export const isEmpty = (obj?: Record<string, unknown>) => {
  console.log(`obj = ${JSON.stringify(obj, null, 2)}`)
  if (!obj) return false
  console.log({
    length: Object.keys(obj).length,
    objectConstructor: obj.constructor === Object,
    keys: Object.keys(obj),
  })
  return (
    !obj || // 👈 null and undefined check
    (Object.keys(obj).length === 0 && obj.constructor === Object)
  )
}
