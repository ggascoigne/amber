// select fields from object
export function pick<T, D extends keyof T>(o: T, ...props: D[]) {
  return Object.assign({}, ...props.map((prop) => ({ [prop]: o[prop] })))
}

// export function pick2<T, D extends keyof T>(obj: T, ...props: D[]) {
//   return props.reduce((result, prop) => {
//     result[prop] = obj[prop]
//     return result
//   }, {} as T)
// }

export function omit<T, D extends keyof T>(obj: T, ...props: D[]) {
  const result = { ...obj }
  props.forEach((prop) => delete result[prop])
  return result
}
