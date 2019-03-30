import { createBrowserHistory } from 'history'
import React from 'react'
import { Router } from 'react-router-dom'

// used in tests only
const wrapInRouter = child => <Router history={createBrowserHistory()}>{child}</Router>

export default wrapInRouter
