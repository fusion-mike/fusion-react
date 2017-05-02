
import { net, history } from '../utilities'
import { Observable } from 'rxjs/Rx'

const LOGIN = 'fusion/api/auth/LOGIN'
const LOGIN_SUCCESS = 'fusion/api/auth/LOGIN-SUCCESS'
const LOGIN_ERROR = 'fusion/api/auth/LOGIN-ERROR'
const REFRESH = 'fusion/api/auth/REFRESH'
const REFRESH_SUCCESS = 'fusion/api/auth/REFRESH-SUCCESS'
const REFRESH_ERROR = 'fusion/api/auth/REFRESH-ERROR'
const LOGOUT = 'fusion/api/auth/LOGOUT'

const defaultState = {
  authorized: false,
  authorizing: false,
  refreshing: false
}

const store = (state = defaultState, action) => {
  switch (action.type) {
    case LOGIN:
      return Object.assign({}, state, {
        authorized: false,
        authorizing: true,
        refreshing: false
      })
    case REFRESH:
      return Object.assign({}, state, {
        refreshing: true
      })
    case LOGIN_SUCCESS:
      return Object.assign({}, {
        authorized: true,
        authorizing: false,
        refreshing: false,
        access_token: action.data.access_token,
        refresh_token: action.data.refresh_token
      })
    case REFRESH_SUCCESS:
      return Object.assign({}, {
        authorized: true,
        authorizing: false,
        refreshing: false,
        access_token: action.data.access_token,
        refresh_token: action.data.refresh_token
      })
    case LOGOUT:
      return Object.assign({}, {
        authorized: false,
        authorizing: false,
        refreshing: false,
        error: action.error
      })
    default:
      return state
  }
}

const authRefreshApi = ({ token }) => (
  net.observable.post({
    uri: '/api/token',
    type: 'form',
    data: {
      grant_type: 'refresh_token',
      refresh_token: token,
      version: '1.0.0'
    }
  })
)

const authLoginApi = ({ username, password }) => (
  net.observable.post({
    uri: '/api/token',
    type: 'form',
    data: {
      grant_type: 'password',
      username: username,
      password: password,
      version: '1.0.0'
    }
  })
)

const authReplayEpic = (action$) => (
  action$.ofType(REFRESH)
    .bufferWhen(() => action$.ofType(REFRESH_SUCCESS))
    .mergeMap(buffer$ => {
      return buffer$
        .map(action => (action.replay))
    })
)

const authRefreshEpic = (action$) => (
  action$.ofType(REFRESH)
    .debounce(() => Observable.interval(500))
    .mergeMap(action => (
      authRefreshApi(action.payload)
        .map(data => ({ type: REFRESH_SUCCESS, data }))
        .catch(err => Observable.of({
          type: LOGOUT,
          error: err
        }))
    ))
)

const authLoginEpic = (action$) => (
  action$.ofType(LOGIN)
    .mergeMap(action => (
      authLoginApi(action.payload)
        .map(data => ({ type: LOGIN_SUCCESS, data }))
        .catch(err => Observable.of({
          type: LOGOUT,
          error: err
        }))
    ))
)

const authLogoutEpic = (action$) => (
  action$.ofType(LOGOUT)
    .mergeMap(action => {
      history.push('/signin')
      return Observable.empty()
    })
)

const apiError = (error, action, state) => {
  if (error.status !== 401) {
    console.error(error)
    return Observable.empty()
  }

  const { auth: { refresh_token }} = state.getState()
  if (refresh_token && refresh_token !== null && refresh_token.length) {
    return Observable.of({
      type: REFRESH,
      replay: action,
      payload: { token: refresh_token }
    })
  }

  return Observable.of({
    type: LOGOUT
  })
}

const apiSignin = (username, password) => (
  (dispatch, getState) => {
    const { auth: { authorizing, authorized }} = getState()
    if (authorizing || authorized)
      return

    dispatch({
      type: LOGIN,
      payload: { username, password }
    })
  }
)

const apiSignout = () => (
  { type: LOGOUT, error: undefined }
)

export default store
export {
  authReplayEpic, authRefreshEpic, authLoginEpic, authLogoutEpic,
  apiError, apiSignin, apiSignout
}
