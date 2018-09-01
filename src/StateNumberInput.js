import React, { Component } from 'react'
import { stateControl } from './stateControl'

function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n)
}

class NumberInput extends Component {
  constructor(props) {
    super(props)
    this.state = {
      editing: false,
      temp: this.props.value,
      fallback: null,
    }
  }

  stepper(change) {
    let new_value = this.state.temp
    if (isNumeric(new_value)) {
      new_value = parseFloat(new_value)
      let new_temp = new_value + change
      this.changer(new_temp)
    }
  }

  changer(new_value) {
    if (new_value < 0) new_value = 0
    this.setState({ temp: new_value })
    this.props.handleChange({ [this.props.update_key]: new_value })
  }

  handleKeyDown(e) {
    let step = 1
    if (this.props.step) step = this.props.step
    switch (e.keyCode) {
      case 38:
        if (e.shiftKey) {
          this.stepper(step * 10)
        } else if (e.ctrlKey) {
          this.stepper(step / 10)
        } else {
          this.stepper(step)
        }
        e.preventDefault()
        break
      case 40:
        if (e.shiftKey) {
          this.stepper(-step * 10)
        } else if (e.ctrlKey) {
          this.stepper(-step / 10)
        } else {
          this.stepper(-step)
        }
        e.preventDefault()
        break
      case 13:
        let new_value = this.state.temp
        if (isNumeric(new_value)) {
          new_value = parseFloat(new_value)
        } else {
          if (this.props.no_fallback) {
            new_value = ''
          } else {
            new_value = this.state.fallback
          }
        }
        this.changer(new_value)
        break
      default:
        // Not up or down
        new_value = this.state.temp
        if (isNumeric(new_value)) {
          new_value = parseFloat(new_value)
          this.setState({ fallback: new_value })
        }
        break
    }
  }

  verify() {
    let new_value = this.state.temp
    if (isNumeric(new_value)) {
      new_value = parseFloat(new_value)
    } else {
      if (this.props.no_fallback) {
        new_value = ''
      } else {
        new_value = this.state.fallback
      }
    }
    this.setState({ editing: false })
    this.changer(new_value)
  }

  handleFocus(e) {
    // e.target.select()
    this.setState({ editing: true })
  }

  handleChange(e) {
    this.setState({ temp: e.target.value })
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.editing === false && this.state.temp !== this.props.value) {
      this.setState({ temp: this.props.value })
    }
  }

  render() {
    let me = this
    return (
      <input
        type="text"
        value={this.state.temp}
        onFocus={this.handleFocus.bind(this)}
        ref={this.props.setRef}
        onKeyDown={this.handleKeyDown.bind(this)}
        onChange={this.handleChange.bind(this)}
        onBlur={this.verify.bind(this)}
      />
    )
  }
}

export default stateControl(NumberInput)
