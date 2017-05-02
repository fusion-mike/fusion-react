
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { history } from '../utilities'
import { apiSignin } from '../modules/api'

class LoginComponent extends Component {
  constructor(params) {
    super(params)

    this.submit = this.submit.bind(this)
  }

  submit(evt) {
    evt.preventDefault()
    evt.stopPropagation()

    const username = this.refs.username.value
    const password = this.refs.password.value
    this.refs.password.value = null

    this.props.signin(username, password)
  }

  componentWillReceiveProps(next) {
    if (next.authorized)
      history.push('/')
  }

  render() {
    const { authorized, authorizing, errorMessage } = this.props

    return (
      <div>
        <div>Fusionetics Signin</div>
        <section>
          <form onSubmit={this.submit} autoComplete={false}>
            <input type="text" ref="username" placeholder="E-Mail" />
            <input type="password" ref="password" placeholder="Password" />
            <button type="submit">Sign In</button>
            <div>
              {errorMessage &&
                <div>{errorMessage}</div>
              }
            </div>
          </form>
        </section>
      </div>
    )
  }
}

const mapState = (state) => {
  const defaultError = { data: { error_description: '' }}
  const { auth: { authorized, authorizing, error = defaultError }} = state
  const { data: { error_description: errorMessage }} = error

  return {
    authorized,
    authorizing,
    errorMessage
  }
}

const mapDispatch = (dispatch) => {
  return {
    signin: (username, password) => {
      dispatch(apiSignin(username, password))
    }
  }
}

const Login = connect(mapState, mapDispatch)(LoginComponent)
export { Login }
