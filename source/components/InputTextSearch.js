
import React, { Component } from 'react'
import { Subject } from 'rxjs/Rx'

export default class extends Component {
  constructor(props) {
    super(props)
    this.subject = new Subject()
    this.changed = this.changed.bind(this)
    this.handled = this.handled.bind(this)
  }

  componentWillMount() {
    this.subject
      .debounceTime(500)
      .map((evt) => evt.target.value)
      .subscribe(this.handled)
  }

  componentWillUnmount() {
    this.subject.unsubscribe()
  }

  changed(evt) {
    evt.persist()
    this.subject.next(evt)
  }

  handled(value) {
    const { search } = this.props
    if (search && search !== null)
      search(value)
  }

  render() {
    return (
      <div>
        <input type="text" onChange={this.changed} />
      </div>
    )
  }
}
