
import React, { Component } from 'react'
import ProfileHeader from '../components/ProfileHeader'

export default class extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    const params = Object.assign({}, this.props)
    delete params.children

    const { children } = this.props
    const clonedChildren = React.Children.map(children, (child) => (
      React.cloneElement(child, params)
    ))

    return (
      <div>
        <ProfileHeader />
        {clonedChildren}
      </div>
    )
  }
}
