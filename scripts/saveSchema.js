#! /usr/bin/env node
const fetch = require('node-fetch')
const { HttpLink } = require('apollo-link-http')
const { introspectSchema } = require('graphql-tools')
const { printSchema } = require('graphql')

const httpLink = new HttpLink({
  uri: 'http://localhost:30001/graphql',
  fetch: fetch
})

void (async () => {
  const schema = await introspectSchema(httpLink)
  // note that the comments get preceded by # since that's what intellij understands
  console.log(printSchema(schema, { commentDescriptions: true }))
})()
