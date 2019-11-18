module.exports = {
  client: {
    includes: [
      './src/**/*.ts',
      './src/**/*.tsx'
    ],
    excludes: ['./src/client/resolvers/*.tsx'],
    service: {
      name: 'acnw',
      localSchemaFile: './graphql-schema.json'
      // url: 'http://localhost:30001/graphql'
    }
  }
}
