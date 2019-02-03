import createHistory from 'history/createBrowserHistory'
import React from 'react'
import { Router } from 'react-router-dom'

// used in tests only
const wrapInRouter = child => <Router history={createHistory()}>{child}</Router>

export default wrapInRouter
