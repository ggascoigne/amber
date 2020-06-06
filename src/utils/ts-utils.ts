import { Maybe } from '../client'

export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>
export type Merge<M, N> = Omit<M, Extract<keyof M, keyof N>> & N

// from https://stackoverflow.com/questions/57683303/how-can-i-see-the-full-expanded-contract-of-a-typescript-type
// expands object types one level deep
export type Expand<T> = T extends infer O ? { [K in keyof O]: O[K] } : never

// expands object types recursively
export type ExpandRecursively<T> = T extends Record<string, unknown>
  ? T extends infer O
    ? { [K in keyof O]: ExpandRecursively<O[K]> }
    : never
  : T

export type MaybeNodes<T> = Array<Maybe<T>> | undefined

export type Nodes<T> = Array<Maybe<T>>

export type Edges<T> = Array<{ node: Maybe<T> }>

export type ThenArg<T> = T extends PromiseLike<infer U> ? U : T

// extract the type from an array
export type UnpackArray<T> = T extends (infer U)[] ? U : T

// extract the type of an object property
export type PropType<TObj, TProp extends keyof TObj> = TObj[TProp]
