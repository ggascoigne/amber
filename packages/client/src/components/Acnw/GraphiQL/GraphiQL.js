import withStyles from '@material-ui/core/styles/withStyles'
import classNames from 'classnames'
import RealGraphiQL from 'graphiql'
import 'graphiql/graphiql.css'
import fetch from 'isomorphic-fetch'
import React from 'react'
import { Page } from 'components/Acnw/Page'

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

const GraphiQL = ({ classes }) => {
  return (
    <Page className={classNames(classes.graphiQlWrapper)}>
      <RealGraphiQL fetcher={graphQLFetcher} />
    </Page>
  )
}

// note that this needs to match what is expected by GraphiQLPage
export default withStyles(styles, { withTheme: true })(GraphiQL)
