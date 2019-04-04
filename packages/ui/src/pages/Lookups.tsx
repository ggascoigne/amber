import { Page } from 'components/Acnw/Page'
import React, { MouseEventHandler } from 'react'

import { LookupsQuery } from '../components/Acnw/LookupsQuery'
import { Table } from '../components/Acnw/Table/Table'
import { ITableSelectedRows } from '../components/Acnw/Table/types'

const columns = [
  {
    name: 'realm',
    label: 'Realm',
    options: {
      filter: true,
      sort: true
    }
  }
]

const onAdd: MouseEventHandler = () => {
  console.log(`add`)
}

const onDelete = (selection: ITableSelectedRows) => {
  console.log(`delete selection = ${JSON.stringify(selection, null, 2)}`)
}

const onEdit = (selection: ITableSelectedRows) => {
  console.log(`edit selection = ${JSON.stringify(selection, null, 2)}`)
}

export const Lookups = () => {
  return (
    <Page>
      <LookupsQuery>
        {({ lookups }) => {
          return (
            <Table
              title={'Lookups'}
              data={lookups.edges.map(v => v.node)}
              columns={columns}
              onAdd={onAdd}
              onDelete={onDelete}
              onEdit={onEdit}
            />
          )
        }}
      </LookupsQuery>
    </Page>
  )
}
