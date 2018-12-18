import React, { Component } from 'react'
import { MainMenu } from './components/navigation/MainMenu'
import { menuData } from './Routing'

export default class App extends Component {
  render() {
    return <MainMenu menuItems={menuData} />
  }
}
