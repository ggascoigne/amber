import withStyles from '@material-ui/core/styles/withStyles'
import classNames from 'classnames'
import { Page } from 'components/Acnw/Page'
import RealGraphiQL from 'graphiql'
import GraphiQLExplorer from 'graphiql-explorer'
import 'graphiql/graphiql.css'
import { buildClientSchema, getIntrospectionQuery } from 'graphql'
import fetch from 'isomorphic-fetch'
import React, { Component } from 'react'
import { getDefaultScalarArgValue, makeDefaultArg } from './CustomArgs'

const styles = theme => ({
  graphiQlWrapper: {
    height: 'calc(100% - 85px) !Important',
    maxHeight: '100vh'
  },
  box: {
    boxSizing: 'content-box',
    border: '1px solid #d6d6d6',
    display: 'flex',
    flexDirection: 'row'
  },
  '@global': {
    '.graphiql-explorer-root': {
      overflow: 'unset !important'
    },
    '.graphiql-container .historyPaneWrap': {
      width: '300px !important',
      boxShadow: 'none !important'
    }
  }
})

function graphQLFetcher(graphQLParams) {
  return fetch(window.location.origin + '/graphql', {
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(graphQLParams)
  }).then(response => response.json())
}

class GraphiQL extends Component {
  _graphiql
  state = { schema: null, query: '', explorerIsOpen: true }

  componentDidMount() {
    graphQLFetcher({
      query: getIntrospectionQuery()
    }).then(result => {
      this.setState({ schema: buildClientSchema(result.data) })
    })
  }

  _handleEditQuery = query => this.setState({ query })

  _handleToggleExplorer = () => {
    this.setState({ explorerIsOpen: !this.state.explorerIsOpen })
  }

  render() {
    const { classes } = this.props
    const { query, schema } = this.state
    return (
      <Page className={classNames(classes.graphiQlWrapper)}>
        <div className={classNames(classes.box, 'graphiql-container')}>
          <GraphiQLExplorer
            schema={schema}
            query={query}
            onEdit={this._handleEditQuery}
            explorerIsOpen={this.state.explorerIsOpen}
            onToggleExplorer={this._handleToggleExplorer}
            getDefaultScalarArgValue={getDefaultScalarArgValue}
            makeDefaultArg={makeDefaultArg}
          />
          <RealGraphiQL
            ref={ref => (this._graphiql = ref)}
            fetcher={graphQLFetcher}
            schema={schema}
            query={query}
            onEditQuery={this._handleEditQuery}
          >
            <RealGraphiQL.Toolbar>
              <RealGraphiQL.Button
                onClick={() => this._graphiql.handlePrettifyQuery()}
                label='Prettify'
                title='Prettify Query (Shift-Ctrl-P)'
              />
              <RealGraphiQL.Button
                onClick={() => this._graphiql.handleToggleHistory()}
                label='History'
                title='Show History'
              />
              <RealGraphiQL.Button onClick={this._handleToggleExplorer} label='Explorer' title='Toggle Explorer' />
            </RealGraphiQL.Toolbar>
          </RealGraphiQL>
        </div>
      </Page>
    )
  }
}

// note that this needs to match what is expected by GraphiQLPage
export default withStyles(styles, { withTheme: true })(GraphiQL)
