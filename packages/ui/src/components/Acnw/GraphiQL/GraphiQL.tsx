import 'graphiql/graphiql.css'

import { createStyles } from '@material-ui/core'
import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles'
import classNames from 'classnames'
import { Page } from 'components/Acnw/Page'
import RealGraphiQL from 'graphiql'
import GraphiQLExplorer from 'graphiql-explorer'
import { GraphQLSchema, buildClientSchema, getIntrospectionQuery, parse } from 'graphql'
import fetch from 'isomorphic-fetch'
import React, { Component } from 'react'

import { getDefaultScalarArgValue, makeDefaultArg } from './CustomArgs'

const styles = createStyles({
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

function graphQLFetcher(graphQLParams: object) {
  return fetch(window.location.origin + '/graphql', {
    method: 'post',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(graphQLParams)
  })
    .then(response => response.text())
    .then(responseBody => {
      try {
        return JSON.parse(responseBody)
      } catch (e) {
        return responseBody
      }
    })
}

type State = {
  schema: GraphQLSchema | null
  query: string
  explorerIsOpen: boolean
}

type Props = WithStyles<typeof styles>

class GraphiQL extends Component<Props, State> {
  _graphiql: any
  state = { schema: null, query: '', explorerIsOpen: true }

  componentDidMount() {
    graphQLFetcher({
      query: getIntrospectionQuery()
    }).then(result => {
      const editor = this._graphiql.getQueryEditor()
      editor.setOption('extraKeys', {
        ...(editor.options.extraKeys || {}),
        'Shift-Alt-LeftClick': this._handleInspectOperation
      })
      this.setState({ schema: buildClientSchema(result.data) })
    })
  }

  _handleInspectOperation = (cm: any, mousePos: { line: number; ch: number }) => {
    const parsedQuery = parse(this.state.query || '')

    if (!parsedQuery) {
      console.error("Couldn't parse query document")
      return null
    }

    const token = cm.getTokenAt(mousePos)
    const start = { line: mousePos.line, ch: token.start }
    const end = { line: mousePos.line, ch: token.end }
    const relevantMousePos = {
      start: cm.indexFromPos(start),
      end: cm.indexFromPos(end)
    }

    const position = relevantMousePos

    const def = parsedQuery.definitions.find(definition => {
      if (!definition.loc) {
        console.log('Missing location information for definition')
        return false
      }

      const { start, end } = definition.loc
      return start <= position.start && end >= position.end
    })

    if (!def) {
      console.error('Unable to find definition corresponding to mouse position')
      return null
    }

    const operationKind =
      def.kind === 'OperationDefinition' ? def.operation : def.kind === 'FragmentDefinition' ? 'fragment' : 'unknown'

    const operationName =
      def.kind === 'OperationDefinition' && !!def.name
        ? def.name.value
        : def.kind === 'FragmentDefinition' && !!def.name
        ? def.name.value
        : 'unknown'

    const selector = `.graphiql-explorer-root #${operationKind}-${operationName}`

    const el = document.querySelector(selector)
    el && el.scrollIntoView()
  }

  _handleEditQuery = (query: string) => this.setState({ query })

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
            onRunOperation={(operationName: string) => this._graphiql.handleRunQuery(operationName)}
            explorerIsOpen={this.state.explorerIsOpen}
            onToggleExplorer={this._handleToggleExplorer}
            getDefaultScalarArgValue={getDefaultScalarArgValue}
            makeDefaultArg={makeDefaultArg}
          />
          <RealGraphiQL
            ref={(ref: any) => (this._graphiql = ref)}
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
