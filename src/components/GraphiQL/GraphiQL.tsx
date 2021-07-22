import 'graphiql/graphiql.css'

import { createStyles, makeStyles } from '@material-ui/core'
import clsx from 'clsx'
import RealGraphiQL from 'graphiql'
import GraphiQLExplorer from 'graphiql-explorer'
import { GraphQLSchema, buildClientSchema, getIntrospectionQuery, parse } from 'graphql'
import fetch from 'isomorphic-fetch'
import React, { useCallback, useEffect, useRef, useState } from 'react'

import { useToken } from '../Auth'
import { Page } from '../Page'

export const useStyles = makeStyles(
  createStyles({
    graphiQlWrapper: {
      height: 'calc(100% - 64px) !Important',
      maxHeight: '100vh',
      padding: 12,
    },
    box: {
      boxSizing: 'content-box',
      height: '100%',
      border: '1px solid #d6d6d6',
      display: 'flex',
      flexDirection: 'row',
      width: '100%',
    },
    '@global': {
      '.graphiql-explorer-root': {
        overflow: 'unset !important',
        padding: '0 !important',
      },
      '.graphiql-explorer-root > :first-child': {
        padding: '8px 8px 0 8px',
        overflowX: 'hidden !important',
      },
      '.graphiql-explorer-root > :nth-child(2)': {
        padding: '0px 8px 0 8px',
      },
      '.graphiql-container .execute-button:focus': {
        outline: 0,
      },
      '.graphiql-container .historyPaneWrap': {
        width: '300px !important',
        boxShadow: 'none !important',
      },
    },
  })
)

const graphQLFetcher = (jwtToken?: string) => (graphQLParams: any) =>
  fetch(window.location.origin + '/api/graphql', {
    method: 'post',
    headers: jwtToken
      ? {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${jwtToken}`,
        }
      : {
          'Content-Type': 'application/json',
        },
    body: JSON.stringify(graphQLParams),
  })
    .then((response) => response.text())
    .then((responseBody) => {
      try {
        return JSON.parse(responseBody)
      } catch (e) {
        return responseBody
      }
    })

interface Props {
  auth?: { jwtToken?: string }
}

const GraphiQL: React.FC<Props> = ({ auth = {} }) => {
  const _graphiql = useRef<any>(null)
  const [schema, setSchema] = useState<GraphQLSchema | null>(null)
  const [query, setQuery] = useState<string>('')
  const [explorerIsOpen, setExplorerIsOpen] = useState<boolean>(true)
  const classes = useStyles({})
  const [jwtToken] = useToken()

  const handleInspectOperation = useCallback(
    (cm: any, mousePos: { line: number; ch: number }) => {
      const parsedQuery = parse(query || '')
      const token = cm.getTokenAt(mousePos)
      const start = { line: mousePos.line, ch: token.start }
      const end = { line: mousePos.line, ch: token.end }
      const position = {
        start: cm.indexFromPos(start),
        end: cm.indexFromPos(end),
      }

      const def = parsedQuery.definitions.find((definition) => {
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
          : def.kind === 'FragmentDefinition'
          ? def.name.value
          : 'unknown'

      const selector = `.graphiql-explorer-root #${operationKind}-${operationName}`

      document.querySelector(selector)?.scrollIntoView()
    },
    [query]
  )

  useEffect(() => {
    graphQLFetcher(jwtToken)({
      query: getIntrospectionQuery(),
    }).then((result) => {
      const editor = _graphiql.current?.getQueryEditor()
      editor?.setOption('extraKeys', {
        ...(editor.options.extraKeys || {}),
        'Shift-Alt-LeftClick': handleInspectOperation,
      })
      setSchema(buildClientSchema(result.data))
    })
  }, [handleInspectOperation, jwtToken])

  const handleEditQuery = useCallback((query: string) => setQuery(query), [])

  const handleToggleExplorer = useCallback(() => {
    setExplorerIsOpen((old) => !old)
  }, [])

  return (
    <Page title='GraphiQL' hideTitle className={clsx(classes.graphiQlWrapper)}>
      <div className={clsx(classes.box, 'graphiql-container')}>
        <GraphiQLExplorer
          schema={schema}
          query={query}
          onEdit={handleEditQuery}
          onRunOperation={(operationName: string) => _graphiql.current.handleRunQuery(operationName)}
          explorerIsOpen={explorerIsOpen}
          onToggleExplorer={handleToggleExplorer}
        />
        <RealGraphiQL
          ref={_graphiql}
          fetcher={graphQLFetcher(jwtToken)}
          schema={schema}
          query={query}
          onEditQuery={handleEditQuery}
        >
          <RealGraphiQL.Toolbar>
            <RealGraphiQL.Button
              onClick={() => _graphiql.current.handlePrettifyQuery()}
              label='Prettify'
              title='Prettify Query (Shift-Ctrl-P)'
            />
            <RealGraphiQL.Button
              onClick={() => _graphiql.current.handleMergeQuery()}
              title='Merge Query (Shift-Ctrl-M)'
              label='Merge'
            />
            <RealGraphiQL.Button
              onClick={() => _graphiql.current.handleCopyQuery()}
              title='Copy Query (Shift-Ctrl-C)'
              label='Copy'
            />{' '}
            <RealGraphiQL.Button
              onClick={() => _graphiql.current.handleToggleHistory()}
              label='History'
              title='Show History'
            />
            <RealGraphiQL.Button onClick={handleToggleExplorer} label='Explorer' title='Toggle Explorer' />
          </RealGraphiQL.Toolbar>
        </RealGraphiQL>
      </div>
    </Page>
  )
}

export default GraphiQL
