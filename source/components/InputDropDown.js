
import React, { Component } from 'react'
import ClickListener from './ClickListener'

export default class extends Component {
  constructor(props) {
    super(props)
    this.state = {
      visible: false
    }

    this.activated = this.activated.bind(this)
    this.deactivated = this.deactivated.bind(this)
    this.optionClicked = this.optionClicked.bind(this)
  }

  activated(evt) {
    evt.preventDefault()
    const { visible } = this.state
    this.setState({
      visible: !visible
    })
  }

  deactivated(evt) {
    evt.preventDefault()
    this.setState({
      visible: false
    })
  }

  optionClicked(option, evt) {
    const { selected } = this.props
    const { selectedOption } = this.state

    const concern = (selectedOption && selectedOption.name === option.name)
      ? undefined
      : option

    this.setState({ visible: false, selectedOption: concern },
      () => {
        this.refs.select.value = (concern) ? option.name : null
        if (selected)
          selected(concern)
      })
  }

  render() {
    return (
      <ClickListener onClickOutside={this.deactivated}>
        <div>
          <div>
            <input ref="select" type="text" readOnly={true} onClick={this.activated}
              placeholder="Select..." />
          </div>
          { this.renderOptions() }
        </div>
      </ClickListener>
    )
  }

  renderOptions() {
    const { options } = this.props
    const { visible } = this.state
    
    if (!visible)
      return null

    return (
      <div>
        { options.map((option, index) => (
          <div key={`option_${index}`} onClick={this.optionClicked.bind(this, option)}>
            {option.name}
          </div>
        ))}
      </div>
    )
  }
}
