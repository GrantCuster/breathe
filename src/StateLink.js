import React, { Component } from 'react'
import { stateControl } from './stateControl'

let button_reset = {
  fontSize: '100%',
  fontFamily: 'inherit',
  border: 0,
  padding: 0,
  textDecoration: 'underline',
  cursor: 'pointer',
}

class StateLink extends Component {
  handleClick(update) {
    this.props.handleChange(this.props.update)
  }

  render() {
    let { style = {} } = this.props
    let button_style = Object.assign({}, button_reset, style)
    return (
      <button style={button_style} onClick={this.handleClick.bind(this)}>
        {this.props.children}
      </button>
    )
  }
}

export default stateControl(StateLink)
