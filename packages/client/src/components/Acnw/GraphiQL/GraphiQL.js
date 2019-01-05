import withStyles from '@material-ui/core/styles/withStyles'
import classNames from 'classnames'
import { Page } from 'components/Acnw/Page'
import RealGraphiQL from 'graphiql'
import 'graphiql/graphiql.css'
import { isLeafType, isNonNullType } from 'graphql'
import fetch from 'isomorphic-fetch'
import React from 'react'

const styles = theme => ({
  graphiQlWrapper: {
    boxSizing: 'content-box',
    height: 'calc(100% - 112px)'
  }
})

function graphQLFetcher(graphQLParams) {
  return fetch(window.location.origin + '/graphql', {
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(graphQLParams)
  }).then(response => response.json())
}

function getDefaultFieldNames(type) {
  // If this type cannot access fields, then return an empty set.
  if (!type.getFields) {
    return []
  }

  const fields = type.getFields()
  if (fields['edges']) {
    return ['edges']
  }
  if (fields['node']) {
    return ['node']
  }

  // Include all leaf-type fields.
  const leafFieldNames = []
  Object.keys(fields).forEach(fieldName => {
    if (
      isLeafType(fields[fieldName].type) ||
      (isNonNullType(fields[fieldName].type) && isLeafType(fields[fieldName].type.ofType))
    ) {
      leafFieldNames.push(fieldName)
    }
  })
  return leafFieldNames
}

const GraphiQL = ({ classes }) => {
  return (
    <Page className={classNames(classes.graphiQlWrapper)}>
      <RealGraphiQL fetcher={graphQLFetcher} getDefaultFieldNames={getDefaultFieldNames} />
    </Page>
  )
}

// note that this needs to match what is expected by GraphiQLPage
export default withStyles(styles, { withTheme: true })(GraphiQL)
