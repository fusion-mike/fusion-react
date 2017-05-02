
import moment from 'moment'
import { net } from '../utilities'
import { apiError } from './api'

const LOAD = 'fusion/teams/LOAD'
const LOAD_SUCCESS = 'fusion/teams/LOAD-SUCCESS'
const LOAD_ERROR = 'fusion/teams/LOAD-ERROR'
const LIST_ATHLETES = 'fusion/team-athletes/LIST'
const LIST_ATHLETES_SUCCESS = 'fusion/team-athletes/LIST-SUCCESS'
const LIST_ATHLETES_ERROR = 'fusion/team-athletes/LIST-ERROR'
const TEAM_SELECTED = 'fusion/teams/SELECTED'

const defaultState = {
  entries: {},
  athletes: []
}

const store = (state = defaultState, action) => {
  switch (action.type) {
    case LOAD:
      return Object.assign({}, state, {
        athletes: [],
        entries: Object.keys(state.entries)
          .reduce((memo, key) => {
            if (isNaN(key) || +key === +action.payload.teamId)
              return memo

            memo[key] = state.entries[key]
            return memo
          }, {})
      })
    case LOAD_SUCCESS:
      return Object.assign({}, state, {
        currentTeamId: action.data.ID,
        entries: Object.assign({}, state.entries, {
          [action.data.ID]: action.data
        })
      })
    case LIST_ATHLETES_SUCCESS:
      return Object.assign({}, state, {
        athletes: action.data
      })
    case LOAD_ERROR:
    case LIST_ATHLETES_ERROR:
      return Object.assign({}, state, {
        error: action.error
      })
    case TEAM_SELECTED:
      return Object.assign({}, state, {
        currentTeamId: +action.payload.teamId
      })
    default:
      return state
  }
}

const teamLoadApi = (teamId, state) => {
  const { auth: { access_token }} = state.getState()
  return net.observable.get({
    uri: '/api/team/' + teamId,
    token: access_token
  })
}

const teamListAthletesApi = (teamId, state) => {
  const { auth: { access_token }} = state.getState()
  return net.observable.get({
    uri: '/api/team/' + teamId + '/athletes',
    token: access_token
  })
}

const teamLoadEpic = (action$, state) => (
  action$.ofType(LOAD)
    .mergeMap(action => (
      teamLoadApi(action.payload.teamId, state)
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

const teamListAthletesEpic = (action$, state) => (
  action$.ofType(LIST_ATHLETES)
    .mergeMap(action => (
      teamListAthletesApi(action.payload.teamId, state)
        .map(data => ({
          type: LIST_ATHLETES_SUCCESS,
          data: data
        }))
        .catch(err => (
          apiError(err, action, state)
            .defaultIfEmpty({
              type: LIST_ATHLETES_ERROR,
              error: err
            })
        ))
    ))
)

const teamLoad = (teamId) => (
  (dispatch, getState) => {
    const { team: { currentTeamId, entries = {} }} = getState()

    if (currentTeamId === +teamId) {
      const team = entries[+teamId]
      if (team && team !== null) {
        const stale = moment().subtract(30, 'seconds')
        const fetched = moment(team.fetched)
        if (fetched.isAfter(stale)) {
          dispatch({
            type: TEAM_SELECTED,
            payload: { teamId: teamId }
          })
          return
        }
      }
    }

    dispatch({
      type: LOAD,
      payload: { teamId: teamId }
    })
  }
)

const teamListAthletes = (teamId) => (
  (dispatch, getState) => {
    const { team: { currentTeamId, entries = {}, athletes = [] }} = getState()

    if (currentTeamId === +teamId) {
      const team = entries[+teamId]
      if (team && team !== null) {
        const stale = moment().subtract(30, 'seconds')
        const fetched = moment(team.fetched)
        if (fetched.isAfter(stale))
          return
      }
    }

    dispatch({
      type: LIST_ATHLETES,
      payload: { teamId: teamId }
    })
  }
)

export default store
export {
  teamLoadEpic, teamListAthletesEpic,
  teamLoad, teamListAthletes
}
