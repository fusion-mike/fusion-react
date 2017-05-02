
import React, { Component } from 'react'
import { history } from '../utilities'

export default class extends Component {
  navigate(evt) {
    evt.preventDefault()
    history.push({
      pathname: evt.currentTarget.pathname,
      search: evt.currentTarget.search
    })
  }

  render() {
    const { to, children } = this.props
    return (<a href={to} onClick={this.navigate}>{children}</a>)
  }
}
