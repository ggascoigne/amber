import { createBrowserHistory } from 'history'
import React, { ReactElement } from 'react'
import { Router } from 'react-router-dom'

// used in tests only
const wrapInRouter = (child: React.ReactElement): ReactElement => (
  <Router history={createBrowserHistory()}>{child}</Router>
)

export default wrapInRouter
