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
    'src/client/graphql/': {
      preset: 'client',
      presetConfig: {
        fragmentMasking: false,
      },
    },
  },
  hooks: {
    afterOneFileWrite: ['prettier --write'],
  },
}

export default config
