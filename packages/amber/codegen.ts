/* eslint-disable import/no-extraneous-dependencies */
import { CodegenConfig } from '@graphql-codegen/cli'

const config: CodegenConfig = {
  overwrite: true,
  schema: '../database/shared/graphql-schema.graphql',
  documents: '../database/shared/graphql/*.graphql',
  config: {
    scalars: {
      Datetime: 'string',
      JSON: '{ [key: string]: any }',
    },
    nonOptionalTypename: true,
  },
  generates: {
    'client/graphql.ts': {
      plugins: [
        {
          add: {
            content: [
              '/* DO NOT EDIT! This file is auto-generated by graphql-code-generator - see `codegen.ts` */',
              '/* eslint-disable @typescript-eslint/ban-types,no-duplicate-imports,etc/prefer-interface,import/order,import/newline-after-import */',
              "import { QueryError } from './error'",
            ],
          },
        },
        'typescript',
        'typescript-operations',
        'typescript-react-query',
      ],
      config: {
        fetcher: {
          func: './fetcher#useFetchData',
          isReactHook: true,
        },
        errorType: 'QueryError',
        optimizeDocumentNode: true,
        declarationKind: 'interface',
      },
    },
  },
  hooks: {
    afterOneFileWrite: ['prettier --write'],
  },
}

export default config
