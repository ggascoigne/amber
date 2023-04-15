import React, { useState } from 'react'

import { useExplorerPlugin } from '@graphiql/plugin-explorer'
import '@graphiql/plugin-explorer/dist/style.css'
import { createGraphiQLFetcher } from '@graphiql/toolkit'
import { Box } from '@mui/material'
import { GraphiQL as RealGraphiQL } from 'graphiql'
import 'graphiql/graphiql.css'
import fetch from 'isomorphic-fetch'

import { Page } from '../Page'

const fetcher = createGraphiQLFetcher({
  url: `${window.location.origin}/api/graphql`,
  fetch,
})

const GraphiQL: React.FC = () => {
  const [query, setQuery] = useState<string>('')
  const explorerPlugin = useExplorerPlugin({
    query,
    onEdit: setQuery,
    showAttribution: false, // credited on the credits page
  })

  return (
    <Page
      title='GraphiQL'
      hideTitle
      sx={{
        height: 'calc(100% - 64px) !Important',
        maxHeight: '100vh',
        padding: 1.5,
      }}
    >
      <Box
        sx={{
          boxSizing: 'content-box',
          height: '100%',
          border: '1px solid #d6d6d6',
          display: 'flex',
          flexDirection: 'row',
          width: '100%',
        }}
        className='graphiql-container'
      >
        <RealGraphiQL fetcher={fetcher} query={query} onEditQuery={setQuery} plugins={[explorerPlugin]} />
      </Box>
    </Page>
  )
}

export default GraphiQL
