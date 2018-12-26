// copied then trimmed from https://raw.githubusercontent.com/auth0/auth0.js/master/src/helper/object.js

/* eslint-disable no-param-reassign */
/* eslint-disable no-restricted-syntax */
/* eslint-disable guard-for-in */

function camelToSnake(str) {
  let newKey = ''
  let index = 0
  let code
  let wasPrevNumber = true
  let wasPrevUppercase = true

  while (index < str.length) {
    code = str.charCodeAt(index)
    if ((!wasPrevUppercase && code >= 65 && code <= 90) || (!wasPrevNumber && code >= 48 && code <= 57)) {
      newKey += '_'
      newKey += str[index].toLowerCase()
    } else {
      newKey += str[index].toLowerCase()
    }
    wasPrevNumber = code >= 48 && code <= 57
    wasPrevUppercase = code >= 65 && code <= 90
    index++
  }

  return newKey
}

function snakeToCamel(str) {
  let parts = str.split('_')
  return parts.reduce(function(p, c) {
    return p + c.charAt(0).toUpperCase() + c.slice(1)
  }, parts.shift())
}

export function toSnakeCase(object, exceptions) {
  if (typeof object !== 'object' || object === null) {
    return object
  }
  exceptions = exceptions || []

  return Object.keys(object).reduce(function(p, key) {
    let newKey = exceptions.indexOf(key) === -1 ? camelToSnake(key) : key
    p[newKey] = toSnakeCase(object[key])
    return p
  }, {})
}

export function toCamelCase(object, exceptions) {
  if (typeof object !== 'object' || object === null) {
    return object
  }

  exceptions = exceptions || []

  return Object.keys(object).reduce(function(p, key) {
    let newKey = exceptions.indexOf(key) === -1 ? snakeToCamel(key) : key
    p[newKey] = toCamelCase(object[key])
    return p
  }, {})
}
