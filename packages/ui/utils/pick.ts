// select fields from object
export function pick<T, D extends keyof T = keyof T>(o: T, ...props: D[]): Pick<T, D> {
  return Object.assign({}, ...props.map((prop) => ({ [prop]: o[prop] })))
}

// Select fields from object and convert null values to undefined
export function pickAndConvertNull<T, D extends keyof T = keyof T>(
  o: T,
  ...props: D[]
): { [K in D]: Exclude<T[K], null> | undefined } {
  return Object.assign(
    {},
    ...props.map((prop) => ({
      [prop]: o[prop] ?? undefined,
    })),
  )
}
// export function pick2<T, D extends keyof T>(obj: T, ...props: D[]) {
//   return props.reduce((result, prop) => {
//     result[prop] = obj[prop]
//     return result
//   }, {} as T)
// }

export function omit<T, D extends keyof T>(obj: T, ...props: D[]): Omit<T, D> {
  const result = { ...obj }
  props.forEach((prop) => delete result[prop])
  return result
}
