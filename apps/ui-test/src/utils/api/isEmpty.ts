// based on https://stackoverflow.com/questions/679915/how-do-i-test-for-an-empty-javascript-object
// as the most minimal and fastest object.isEmpty

export const isEmpty = (obj: any): boolean => {
  // eslint-disable-next-line no-restricted-syntax, guard-for-in, no-unreachable-loop
  for (const i in obj) {
    return false
  }
  return true
}
