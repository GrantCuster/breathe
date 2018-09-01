import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import * as queryString from 'qs'
import { default_state, default_state_string, filterState } from './State'

let time_ref = Date.now()
let status = 'in'
function toggleStatus(status) {
  if (status === 'in') return 'out'
  if (status === 'out') return 'in'
}
let small_radius = 0.3
let big_radius = 0.8
let counter = 0
let $counter

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      ww: window.innerWidth,
      wh: window.innerHeight,
      mounted: false,
      ctx: null,
    }
    this.draw = this.draw.bind(this)
    this.setCtx = canvas => {
      this.setState({ ctx: canvas.getContext('2d') })
    }
    this.setCounter = counter_div => {
      $counter = counter_div
    }
  }

  componentDidMount() {
    let dirty_url_state = queryString.parse(this.props.location.search, {
      ignoreQueryPrefix: true,
    })
    let dirty_url_state_string = queryString.stringify(dirty_url_state, {
      encode: false,
    })
    let filtered_url_state = filterState(dirty_url_state)
    if (dirty_url_state_string !== default_state_string) {
      let updated_state = Object.assign({}, default_state, filtered_url_state)
      let updated_search = queryString.stringify(updated_state, {
        encode: false,
      })
      this.props.history.replace({
        pathname: process.env.PUBLIC_URL,
        search: updated_search,
      })
    }

    this.setState({ mounted: true })

    let me = this
    function animate() {
      requestAnimationFrame(animate)
      me.draw()
    }
    animate()

    window.addEventListener('resize', this.updateWindowWidth.bind(this))
  }

  draw() {
    let dirty_url_state = queryString.parse(this.props.location.search, {
      ignoreQueryPrefix: true,
    })
    let filtered_url_state = filterState(dirty_url_state)
    let breathe_in = parseFloat(filtered_url_state.in) * 1000
    let breathe_out = parseFloat(filtered_url_state.out) * 1000
    let now = Date.now()
    let delta = now - time_ref
    let duration = status === 'out' ? breathe_in : breathe_out
    if (delta >= duration) {
      status = toggleStatus(status)
      time_ref = now
      delta = 0
      counter += 1
      $counter.innerText = counter + 1
    }
    let changer
    let radius_max = Math.min(this.state.ww / 2, this.state.wh / 2)
    if (status === 'out') {
      changer = delta / duration
    } else {
      changer = (duration - delta) / duration
    }
    let radius =
      small_radius * radius_max +
      changer * (big_radius * radius_max - small_radius * radius_max)
    if (this.state.ctx) {
      let ctx = this.state.ctx
      ctx.clearRect(0, 0, this.state.ww, this.state.wh)
      ctx.beginPath()
      ctx.arc(
        this.state.ww / 2,
        this.state.wh / 2,
        big_radius * radius_max,
        0,
        Math.PI * 2,
        true
      )
      ctx.fillStyle = '#ccc'
      ctx.fill()
      ctx.beginPath()
      ctx.arc(
        this.state.ww / 2,
        this.state.wh / 2,
        radius,
        0,
        Math.PI * 2,
        true
      )
      ctx.fillStyle = '#000'
      ctx.fill()
      ctx.beginPath()
      ctx.arc(
        this.state.ww / 2,
        this.state.wh / 2,
        small_radius * radius_max,
        0,
        Math.PI * 2,
        true
      )
      ctx.fillStyle = '#777'
      ctx.fill()
    }
  }

  updateWindowWidth() {
    this.setState({ ww: window.innerWidth, wh: window.innerHeight })
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateWindowWidth.bind(this))
  }

  render() {
    let radius_max = Math.min(this.state.ww / 2, this.state.wh / 2)
    return this.state.mounted ? (
      <div
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          overflow: 'hidden',
        }}
      >
        <canvas
          ref={this.setCtx}
          className="App"
          width={this.state.ww}
          height={this.state.wh}
        />
        <div
          ref={this.setCounter}
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            color: '#fff',
            fontSize: `${0.15 * radius_max}px`,
            fontFamily: 'monospace',
          }}
        >
          1
        </div>
      </div>
    ) : null
  }
}

export default withRouter(App)
