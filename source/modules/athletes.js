
import moment from 'moment'
import { net } from '../utilities'
import { apiError } from './api'

const LOAD = 'fusion/athletes/LOAD'
const LOAD_SUCCESS = 'fusion/athletes/LOAD-SUCCESS'
const LOAD_ERROR = 'fusion/athletes/LOAD-ERROR'
const TEAM_LOAD_SUCCESS = 'fusion/teams/LOAD-SUCCESS'
const TEAM_SELECTED = 'fusion/teams/SELECTED'
const ATHLETE_SELECTED = 'fusion/athletes/SELECTED'

const defaultState = {
  currentTeamId: undefined,
  currentAthleteId: undefined,
  entries: {}
}

const store = (state = {}, action) => {
  switch (action.type) {
    case LOAD_SUCCESS:
      return Object.assign({}, state, {
        currentAthleteId: action.data.AthleteId,
        entries: Object.assign({}, state.entries, {
          [action.data.AthleteId]: action.data
        }),
        recents: (state.recents.indexOf(action.data.AthleteId) !== -1)
          ? state.recents
          : state.recents.concat(action.data.AthleteId),
        error: undefined
      })
    case LOAD_ERROR:
      return Object.assign({}, state, {
        error: action.error
      })
    case ATHLETE_SELECTED:
      return Object.assign({}, state, {
        currentAthleteId: +action.payload.athleteId
      })
    case TEAM_LOAD_SUCCESS:
      return (state.currentTeamId === action.data.ID)
        ? state
        : Object.assign({}, state, {
            currentTeamId: action.data.ID,
            currentAthleteId: undefined,
            entries: {},
            recents: [],
          })
    case TEAM_SELECTED:
      return (state.currentTeamId === +action.payload.teamId)
        ? state
        : Object.assign({}, state, {
            currentTeamId: +action.payload.teamId,
            currentAthleteId: undefined,
            entries: {},
            recents: [],
          })
    default:
      return state
  }
}

const athleteLoadApi = ({ teamId, athleteId }, state) => {
  const { auth: { access_token }} = state.getState()
  return net.observable.get({
    uri: '/api/team/' + teamId + '/athletes/' + athleteId,
    token: access_token
  })
}

const athleteLoadEpic = (action$, state) => (
  action$.ofType(LOAD)
    .mergeMap(action => (
      athleteLoadApi(action.payload, state)
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

const athleteLoad = (teamId, athleteId) => (
  (dispatch, getState) => {
    const { athlete: { entries = {} }} = getState()
    const athlete = entries[athleteId]

    if (athlete && athlete !== null) {
      const stale = moment().subtract(30, 'seconds')
      const fetched = moment(athlete.fetched)
      if (fetched.isAfter(stale)) {
        dispatch({
          type: ATHLETE_SELECTED,
          payload: { athleteId: athleteId }
        })
        return
      }
    }

    dispatch({
      type: LOAD,
      payload: { teamId: teamId, athleteId: athleteId }
    })
  }
)

export default store
export {
  athleteLoadEpic,
  athleteLoad
}
