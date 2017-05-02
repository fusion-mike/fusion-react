
import moment from 'moment'
import { net } from '../utilities'
import { apiError } from './api'
import { mapProfileApi } from '../mappers/profile'

const LOAD = 'fusion/profile/LOAD'
const LOAD_SUCCESS = 'fusion/profile/LOAD-SUCCESS'
const LOAD_ERROR = 'fusion/profile/LOAD-ERROR'

const defaultState = {
  profile: undefined,
  teams: [],
  facilities: []
}

const store = (state = defaultState, action) => {
  switch (action.type) {
    case LOAD_SUCCESS:
      return Object.assign({}, state, {
        profile: action.data.profile,
        teams: action.data.teams,
        facilities: action.data.facilities,
        fetched: action.data.fetched
      })
    case LOAD_ERROR:
      return Object.assign({}, state, {
        error: action.error
      })
    default:
      return state
  }
}

const profileLoadApi = (state) => {
  const { auth: { access_token }} = state.getState()
  return net.observable.get({
    uri: '/api/profile',
    token: access_token
  })
}

const profileLoadEpic = (action$, state) => (
  action$.ofType(LOAD)
    .mergeMap(action => (
      profileLoadApi(state)
      .map(data => mapProfileApi(data))
        .map(data => ({
          type: LOAD_SUCCESS,
          data: Object.assign({}, data, { fetched: new Date() })
        }))
        .catch(err => (
          apiError(err, action, state)
            .defaultIfEmpty({
              type: LOAD_ERROR,
              error: err
            })
        ))
    ))
)

const profileLoad = () => (
  (dispatch, getState) => {
    const { profile: { profile }, profile: { fetched }} = getState()

    if (profile && profile !== null) {
      const stale = moment().subtract(1, 'minutes')
      const lastFetched = moment(fetched)
      if (lastFetched.isAfter(stale))
        return
    }

    dispatch({ type: LOAD })
  }
)

const profileRefresh = () => (
  { type: LOAD }
)

export default store
export {
  profileLoadEpic,
  profileLoad,
  profileRefresh
}
