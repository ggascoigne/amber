import React, { Component } from 'react'
import { Button, Header, Icon, Menu, Segment, Sidebar } from 'semantic-ui-react'

import './App.css'

class App extends Component {
  state = {visible: false}

  toggleVisibility = () => this.setState({visible: !this.state.visible})

  render () {
    const {visible} = this.state
    return (
      <div>
        <Button onClick={this.toggleVisibility}>
          <Icon name='bars' />
        </Button>
        <Sidebar.Pushable as={Segment}>
          <Sidebar as={Menu} animation='push' width='thin' visible={visible} icon='labeled' vertical inverted>
            <Menu.Item name='home'>
              <Icon name='home' />
              Home
            </Menu.Item>
            <Menu.Item name='gamepad'>
              <Icon name='gamepad' />
              Games
            </Menu.Item>
            <Menu.Item name='camera'>
              <Icon name='camera' />
              Channels
            </Menu.Item>
          </Sidebar>
          <Sidebar.Pusher>
            <Segment basic>
              <Header as='h3'>Application Content</Header>
              <h1 style={{marginTop: 0}}>About AmberCon NW</h1>

              <h2>What is AmberCon NW?</h2>

              <p className='wrap'><span className='test'>AmberCon Northwest</span> is a fully scheduled role-playing
                game convention
                devoted
                to Roger Zelazny's worlds of Amber using Phage Press's <i>Amber Diceless RPG</i>
                by Erick Wujcik. The convention is open to players of all levels of experience;
                our members are united by their interest in diceless role-playing and Zelazny's
                work.</p>

              <h2>What do I get for my money?</h2>

              <p>AmberCon NW offers a <strong>long weekend</strong> of scheduled gaming events,
                <strong>Thursday evening through Sunday evening</strong>. All members choose
                the game events they wish to play and receive their schedule in advance of
                the convention.</p>

              <p>
                The convention is divided into 7 event slots. On Thursday and Friday we have
                shorter slots (4-5 hours). Saturday and Sunday feature longer slots (6+ hours)
                with breaks for meals. Events are run by volunteer member GM's -- this could
                mean you! For a 100-person convention we need at least 12 six- to eight-hour
                games in each of the event slots -- that's 84 events! GM's, if you'd like
                to run a game at the convention, please start thinking now about your scenarios
                section here on the web site.</p>
            </Segment>
          </Sidebar.Pusher>
        </Sidebar.Pushable>
      </div>
    )
  }
}

export default App
