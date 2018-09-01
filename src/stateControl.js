import React, { Component } from 'react'
import { withRouter } from 'react-router'
import * as queryString from 'qs'

export function stateControl(WrappedComponent) {
  return withRouter(
    class extends Component {
      handleChange(update_object) {
        let qs = queryString.parse(this.props.location.search, {
          ignoreQueryPrefix: true,
        })
        let updated_qs = Object.assign({}, qs, update_object)
        let updated_search = queryString.stringify(updated_qs, {
          encode: false,
        })
        if (updated_search !== queryString.stringify(qs, { encode: false })) {
          this.props.history.push({
            pathname: process.env.PUBLIC_URL,
            search: updated_search,
          })
        }
        if (this.props.update_callback) {
          this.props.update_callback()
        }
      }
      render() {
        return (
          <WrappedComponent
            handleChange={this.handleChange.bind(this)}
            {...this.props}
          />
        )
      }
    }
  )
}
