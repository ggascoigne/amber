import withStyles from '@material-ui/core/styles/withStyles'
import contentPageStyles from 'assets/jss/acnw/contentPage'
import classNames from 'classnames'
import RealGraphiQL from 'graphiql'
import 'graphiql/graphiql.css'
import fetch from 'isomorphic-fetch'
import React from 'react'

const styles = theme => ({
  ...contentPageStyles(theme),
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
    <div className={classNames(classes.main, classes.mainRaised, classes.graphiQlWrapper)}>
      <RealGraphiQL fetcher={graphQLFetcher} />
    </div>
  )
}

export default withStyles(styles, { withTheme: true })(GraphiQL)
