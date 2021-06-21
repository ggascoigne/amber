import { Page } from 'components/Page'
import React from 'react'

const Credits = () => (
  <Page title='Credits'>
    <h1>Credits</h1>
    <p>
      This site is built on top of Open Source Software from a number of generous companies and developers, including:{' '}
    </p>
    <a
      href='https://auth0.com/?utm_source=oss&utm_medium=gp&utm_campaign=oss'
      target='_blank'
      rel='noopener noreferrer'
    >
      <img
        width='150'
        height='50'
        alt='JWT Auth for open source projects'
        src='//cdn.auth0.com/oss/badges/a0-badge-light.png'
      />
    </a>{' '}
    Token Based Authentication for open source projects from{' '}
    <a
      href='https://auth0.com/?utm_source=oss&utm_medium=gp&utm_campaign=oss'
      target='_blank'
      rel='noopener noreferrer'
    >
      Auth0
    </a>
    .
    <ul>
      <li>
        The table control used throughout this site is{' '}
        <a href='https://github.com/tannerlinsley/react-table' title='React-Table' target='_new'>
          React-Table
        </a>{' '}
        by Tanner Linsley.
      </li>
      <li>
        The UI toolkit is{' '}
        <a href='https://material-ui.com/' title='Material-UI' target='_new'>
          {' '}
          Material UI
        </a>
        , with parts based on{' '}
        <a href='https://demos.creative-tim.com/material-kit-react' title='Material Kit React' target='_new'>
          Material Kit React
        </a>
      </li>
      <li>
        All of the code is written in{' '}
        <a href='https://www.typescriptlang.org/' title='TypeScript' target='_new'>
          TypeScript
        </a>
      </li>
      <li>
        Database from{' '}
        <a href='https://www.postgresql.org/' title='PostgreSQL' target='_new'>
          PostgreSQL
        </a>
      </li>
      <li>
        Automatic Postgres to GraphQL from{' '}
        <a href='https://www.graphile.org/postgraphile/' title='PostGraphile' target='_new'>
          PostGraphile
        </a>
      </li>
      <li>
        GraphQL client code using{' '}
        <a href='https://www.apollographql.com/' title='Apollo GraphQL' target='_new'>
          Apollo GraphQL
        </a>
      </li>
      <li>
        GraphQL schema to typescript tools from{' '}
        <a href='https://graphql-code-generator.com/' title='Graphql CodeGen' target='_new'>
          Graphql CodeGen
        </a>
      </li>
      <li>
        Schema migration tools by{' '}
        <a href='http://knexjs.org/' title='Knex.js' target='_new'>
          Knex.js
        </a>
      </li>
      <li>
        React Forms using{' '}
        <a href='https://formik.org/' title='Formik' target='_new'>
          Formik
        </a>
      </li>
      <li>
        Email sent using{' '}
        <a href='https://nodemailer.com/about/' title='Nodemailer' target='_new'>
          Nodemailer
        </a>
      </li>
      <li>
        And of course, the whole UI is built using{' '}
        <a href='https://reactjs.org/' title='React' target='_new'>
          React
        </a>
      </li>
      <li>
        Various useful utilities from from{' '}
        <a href='https://usehooks.com' target='_new'>
          {' '}
          Use Hooks
        </a>
      </li>
      <li>
        The Old Stamper font used in the "virtual" convention overlay is from{' '}
        <a href='https://www.dafont.com/typesgal.d3983' target='_new'>
          https://www.dafont.com/typesgal.d3983
        </a>
      </li>
    </ul>
  </Page>
)

export default Credits
