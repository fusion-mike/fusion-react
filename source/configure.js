
import { createStore, applyMiddleware } from 'redux'
import { createEpicMiddleware } from 'redux-observable'
import { composeWithDevTools } from 'redux-devtools-extension'
import thunkMiddleware from 'redux-thunk'

import { stores, epics } from './modules'

const epicMiddleware = createEpicMiddleware(epics)
const configure = () => {
  const state = createStore(
    stores,
    composeWithDevTools(
      applyMiddleware(
        epicMiddleware,
        thunkMiddleware
      )
    )
  )

  if (module.hot) {
    module.hot.accept('./modules', () => {
      const nextReducer = require('./modules').stores
      const nextEpic = require('./modules').epics
      state.replaceReducer(nextReducer)
      epicMiddleware.replaceEpic(nextEpic)
    })
  }

  return state
}

export default configure
