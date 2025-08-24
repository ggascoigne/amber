/* eslint-disable */
import * as types from './graphql'
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core'

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
type Documents = {
  'fragment gameAssignmentFields on GameAssignment {\n  gameId\n  gm\n  memberId\n  nodeId\n  year\n}': typeof types.GameAssignmentFieldsFragmentDoc
  'fragment gameFields on Game {\n  nodeId\n  id\n  name\n  gmNames\n  description\n  genre\n  type\n  setting\n  charInstructions\n  playerMax\n  playerMin\n  playerPreference\n  returningPlayers\n  playersContactGm\n  gameContactEmail\n  estimatedLength\n  slotPreference\n  lateStart\n  lateFinish\n  slotConflicts\n  message\n  slotId\n  teenFriendly\n  year\n  full\n  roomId\n  room {\n    description\n  }\n}\n\nfragment assignmentFields on GameAssignment {\n  ...gameAssignmentFields\n  member {\n    user {\n      email\n      fullName\n    }\n  }\n}\n\nfragment gameGms on Game {\n  gameAssignments(filter: {gm: {lessThan: 0}}) {\n    nodes {\n      ...assignmentFields\n    }\n  }\n}': typeof types.GameFieldsFragmentDoc
  'query getStripe {\n  stripes {\n    nodes {\n      id\n      data\n    }\n  }\n}\n\nmutation createStripe($input: CreateStripeInput!) {\n  createStripe(input: $input) {\n    clientMutationId\n  }\n}': typeof types.GetStripeDocument
  'query getTransaction {\n  transactions {\n    nodes {\n      ...transactionFields\n    }\n  }\n}\n\nquery getTransactionByYear($year: Int!) {\n  transactions(condition: {year: $year}) {\n    nodes {\n      ...transactionFields\n    }\n  }\n}\n\nquery getTransactionByUser($userId: Int!) {\n  transactions(condition: {userId: $userId}) {\n    nodes {\n      ...transactionFields\n    }\n  }\n}\n\nquery getTransactionByYearAndUser($year: Int!, $userId: Int!) {\n  transactions(condition: {year: $year, userId: $userId}) {\n    nodes {\n      ...transactionFields\n    }\n  }\n}\n\nquery getTransactionByYearAndMember($year: Int!, $memberId: Int!) {\n  transactions(condition: {year: $year, memberId: $memberId}) {\n    nodes {\n      ...transactionFields\n    }\n  }\n}\n\nmutation createTransaction($input: CreateTransactionInput!) {\n  createTransaction(input: $input) {\n    transaction {\n      ...transactionFields\n    }\n  }\n}\n\nmutation deleteTransaction($input: DeleteTransactionInput!) {\n  deleteTransaction(input: $input) {\n    clientMutationId\n    deletedTransactionNodeId\n  }\n}\n\nmutation updateTransactionByNodeId($input: UpdateTransactionByNodeIdInput!) {\n  updateTransactionByNodeId(input: $input) {\n    transaction {\n      ...transactionFields\n    }\n  }\n}': typeof types.GetTransactionDocument
  'fragment transactionFields on Transaction {\n  id\n  nodeId\n  userId\n  memberId\n  amount\n  origin\n  stripe\n  timestamp\n  year\n  notes\n  data\n  user {\n    fullName\n  }\n  userByOrigin {\n    fullName\n  }\n  member {\n    year\n  }\n}': typeof types.TransactionFieldsFragmentDoc
}
const documents: Documents = {
  'fragment gameAssignmentFields on GameAssignment {\n  gameId\n  gm\n  memberId\n  nodeId\n  year\n}':
    types.GameAssignmentFieldsFragmentDoc,
  'fragment gameFields on Game {\n  nodeId\n  id\n  name\n  gmNames\n  description\n  genre\n  type\n  setting\n  charInstructions\n  playerMax\n  playerMin\n  playerPreference\n  returningPlayers\n  playersContactGm\n  gameContactEmail\n  estimatedLength\n  slotPreference\n  lateStart\n  lateFinish\n  slotConflicts\n  message\n  slotId\n  teenFriendly\n  year\n  full\n  roomId\n  room {\n    description\n  }\n}\n\nfragment assignmentFields on GameAssignment {\n  ...gameAssignmentFields\n  member {\n    user {\n      email\n      fullName\n    }\n  }\n}\n\nfragment gameGms on Game {\n  gameAssignments(filter: {gm: {lessThan: 0}}) {\n    nodes {\n      ...assignmentFields\n    }\n  }\n}':
    types.GameFieldsFragmentDoc,
  'query getStripe {\n  stripes {\n    nodes {\n      id\n      data\n    }\n  }\n}\n\nmutation createStripe($input: CreateStripeInput!) {\n  createStripe(input: $input) {\n    clientMutationId\n  }\n}':
    types.GetStripeDocument,
  'query getTransaction {\n  transactions {\n    nodes {\n      ...transactionFields\n    }\n  }\n}\n\nquery getTransactionByYear($year: Int!) {\n  transactions(condition: {year: $year}) {\n    nodes {\n      ...transactionFields\n    }\n  }\n}\n\nquery getTransactionByUser($userId: Int!) {\n  transactions(condition: {userId: $userId}) {\n    nodes {\n      ...transactionFields\n    }\n  }\n}\n\nquery getTransactionByYearAndUser($year: Int!, $userId: Int!) {\n  transactions(condition: {year: $year, userId: $userId}) {\n    nodes {\n      ...transactionFields\n    }\n  }\n}\n\nquery getTransactionByYearAndMember($year: Int!, $memberId: Int!) {\n  transactions(condition: {year: $year, memberId: $memberId}) {\n    nodes {\n      ...transactionFields\n    }\n  }\n}\n\nmutation createTransaction($input: CreateTransactionInput!) {\n  createTransaction(input: $input) {\n    transaction {\n      ...transactionFields\n    }\n  }\n}\n\nmutation deleteTransaction($input: DeleteTransactionInput!) {\n  deleteTransaction(input: $input) {\n    clientMutationId\n    deletedTransactionNodeId\n  }\n}\n\nmutation updateTransactionByNodeId($input: UpdateTransactionByNodeIdInput!) {\n  updateTransactionByNodeId(input: $input) {\n    transaction {\n      ...transactionFields\n    }\n  }\n}':
    types.GetTransactionDocument,
  'fragment transactionFields on Transaction {\n  id\n  nodeId\n  userId\n  memberId\n  amount\n  origin\n  stripe\n  timestamp\n  year\n  notes\n  data\n  user {\n    fullName\n  }\n  userByOrigin {\n    fullName\n  }\n  member {\n    year\n  }\n}':
    types.TransactionFieldsFragmentDoc,
}

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: 'fragment gameAssignmentFields on GameAssignment {\n  gameId\n  gm\n  memberId\n  nodeId\n  year\n}',
): (typeof documents)['fragment gameAssignmentFields on GameAssignment {\n  gameId\n  gm\n  memberId\n  nodeId\n  year\n}']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: 'fragment gameFields on Game {\n  nodeId\n  id\n  name\n  gmNames\n  description\n  genre\n  type\n  setting\n  charInstructions\n  playerMax\n  playerMin\n  playerPreference\n  returningPlayers\n  playersContactGm\n  gameContactEmail\n  estimatedLength\n  slotPreference\n  lateStart\n  lateFinish\n  slotConflicts\n  message\n  slotId\n  teenFriendly\n  year\n  full\n  roomId\n  room {\n    description\n  }\n}\n\nfragment assignmentFields on GameAssignment {\n  ...gameAssignmentFields\n  member {\n    user {\n      email\n      fullName\n    }\n  }\n}\n\nfragment gameGms on Game {\n  gameAssignments(filter: {gm: {lessThan: 0}}) {\n    nodes {\n      ...assignmentFields\n    }\n  }\n}',
): (typeof documents)['fragment gameFields on Game {\n  nodeId\n  id\n  name\n  gmNames\n  description\n  genre\n  type\n  setting\n  charInstructions\n  playerMax\n  playerMin\n  playerPreference\n  returningPlayers\n  playersContactGm\n  gameContactEmail\n  estimatedLength\n  slotPreference\n  lateStart\n  lateFinish\n  slotConflicts\n  message\n  slotId\n  teenFriendly\n  year\n  full\n  roomId\n  room {\n    description\n  }\n}\n\nfragment assignmentFields on GameAssignment {\n  ...gameAssignmentFields\n  member {\n    user {\n      email\n      fullName\n    }\n  }\n}\n\nfragment gameGms on Game {\n  gameAssignments(filter: {gm: {lessThan: 0}}) {\n    nodes {\n      ...assignmentFields\n    }\n  }\n}']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: 'query getStripe {\n  stripes {\n    nodes {\n      id\n      data\n    }\n  }\n}\n\nmutation createStripe($input: CreateStripeInput!) {\n  createStripe(input: $input) {\n    clientMutationId\n  }\n}',
): (typeof documents)['query getStripe {\n  stripes {\n    nodes {\n      id\n      data\n    }\n  }\n}\n\nmutation createStripe($input: CreateStripeInput!) {\n  createStripe(input: $input) {\n    clientMutationId\n  }\n}']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: 'query getTransaction {\n  transactions {\n    nodes {\n      ...transactionFields\n    }\n  }\n}\n\nquery getTransactionByYear($year: Int!) {\n  transactions(condition: {year: $year}) {\n    nodes {\n      ...transactionFields\n    }\n  }\n}\n\nquery getTransactionByUser($userId: Int!) {\n  transactions(condition: {userId: $userId}) {\n    nodes {\n      ...transactionFields\n    }\n  }\n}\n\nquery getTransactionByYearAndUser($year: Int!, $userId: Int!) {\n  transactions(condition: {year: $year, userId: $userId}) {\n    nodes {\n      ...transactionFields\n    }\n  }\n}\n\nquery getTransactionByYearAndMember($year: Int!, $memberId: Int!) {\n  transactions(condition: {year: $year, memberId: $memberId}) {\n    nodes {\n      ...transactionFields\n    }\n  }\n}\n\nmutation createTransaction($input: CreateTransactionInput!) {\n  createTransaction(input: $input) {\n    transaction {\n      ...transactionFields\n    }\n  }\n}\n\nmutation deleteTransaction($input: DeleteTransactionInput!) {\n  deleteTransaction(input: $input) {\n    clientMutationId\n    deletedTransactionNodeId\n  }\n}\n\nmutation updateTransactionByNodeId($input: UpdateTransactionByNodeIdInput!) {\n  updateTransactionByNodeId(input: $input) {\n    transaction {\n      ...transactionFields\n    }\n  }\n}',
): (typeof documents)['query getTransaction {\n  transactions {\n    nodes {\n      ...transactionFields\n    }\n  }\n}\n\nquery getTransactionByYear($year: Int!) {\n  transactions(condition: {year: $year}) {\n    nodes {\n      ...transactionFields\n    }\n  }\n}\n\nquery getTransactionByUser($userId: Int!) {\n  transactions(condition: {userId: $userId}) {\n    nodes {\n      ...transactionFields\n    }\n  }\n}\n\nquery getTransactionByYearAndUser($year: Int!, $userId: Int!) {\n  transactions(condition: {year: $year, userId: $userId}) {\n    nodes {\n      ...transactionFields\n    }\n  }\n}\n\nquery getTransactionByYearAndMember($year: Int!, $memberId: Int!) {\n  transactions(condition: {year: $year, memberId: $memberId}) {\n    nodes {\n      ...transactionFields\n    }\n  }\n}\n\nmutation createTransaction($input: CreateTransactionInput!) {\n  createTransaction(input: $input) {\n    transaction {\n      ...transactionFields\n    }\n  }\n}\n\nmutation deleteTransaction($input: DeleteTransactionInput!) {\n  deleteTransaction(input: $input) {\n    clientMutationId\n    deletedTransactionNodeId\n  }\n}\n\nmutation updateTransactionByNodeId($input: UpdateTransactionByNodeIdInput!) {\n  updateTransactionByNodeId(input: $input) {\n    transaction {\n      ...transactionFields\n    }\n  }\n}']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: 'fragment transactionFields on Transaction {\n  id\n  nodeId\n  userId\n  memberId\n  amount\n  origin\n  stripe\n  timestamp\n  year\n  notes\n  data\n  user {\n    fullName\n  }\n  userByOrigin {\n    fullName\n  }\n  member {\n    year\n  }\n}',
): (typeof documents)['fragment transactionFields on Transaction {\n  id\n  nodeId\n  userId\n  memberId\n  amount\n  origin\n  stripe\n  timestamp\n  year\n  notes\n  data\n  user {\n    fullName\n  }\n  userByOrigin {\n    fullName\n  }\n  member {\n    year\n  }\n}']

export function graphql(source: string) {
  return (documents as any)[source] ?? {}
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> =
  TDocumentNode extends DocumentNode<infer TType, any> ? TType : never
