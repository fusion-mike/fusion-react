
import React, { Component } from 'react'
import { findDOMNode } from 'react-dom'

export default class ClickListener extends Component {
  constructor(props) {
    super(props)

    this.handleOutsideClick = this.handleOutsideClick.bind(this)
  }

  componentDidMount() {
    window.__app_container
      .addEventListener('click', this.handleOutsideClick, false)
  }

  componentWillUnmount() {
    window.__app_container
      .removeEventListener('click', this.handleOutsideClick, false)
  }

  handleOutsideClick(evt) {
    const { onClickOutside } = this.props
    if (!onClickOutside)
      return

    const region = findDOMNode(this.refs.region)
    if (!region.contains(evt.target))
      onClickOutside(evt)
  }

  render() {
    return (
      <div ref="region">
        {this.props.children}
      </div>
    )
  }
}