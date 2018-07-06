import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import wrapInRouter from './utils/wrapInRouter'

it('renders without crashing', () => {
  const div = document.createElement('div')
  ReactDOM.render(wrapInRouter(<App />), div)
  ReactDOM.unmountComponentAtNode(div)
})
