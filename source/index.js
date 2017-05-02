
import 'rxjs'
import React, { Component } from 'react'
import { Provider } from 'react-redux'
import { AppContainer } from 'react-hot-loader'
import { render } from 'react-dom'

import configure from './configure'
import routes from './routes'
import { history, router } from './utilities'

const store = configure()
const renderComponent = (component, params) => {
  const clone = React.cloneElement(component, params)
  render(
    <AppContainer>
      <Provider store={store}>
        <div>
          {clone}
        </div>
      </Provider>
    </AppContainer>,
    window.__app_container
  )
}

const locationRedirect = (predicate) => {
  const route = routes.find((route) => (
    predicate(route)
  ))

  if (route)
    history.replace(route.path)
}

const locationRender = (location) => {
  const { auth: { authorized }} = store.getState()
  const matched = router.match(routes, location)

  if (matched && matched !== null) {
    const { route, routeContext } = matched
    if (!authorized && !route.anonymous) {
      locationRedirect((route) => (
        route.default
      ))
      return
    }

    const component = route.action(routeContext)
    if (component) {
      const { params = {}} = routeContext
      renderComponent(component, params)
      return
    }
  }

  locationRedirect((route) => (
    route.missing
  ))
}

document.addEventListener('DOMContentLoaded', evt => {
  window.__app_container = document.body.querySelector('div#view')
  
  history.listen(locationRender)
  locationRender(history.location)
})

if (module.hot) {
  module.hot.accept(['./containers/App', './routes'], () => {
    locationRender(history.location)
  })
}

require('./sass/main.scss')
