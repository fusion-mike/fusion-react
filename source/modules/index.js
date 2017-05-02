
import { combineReducers } from 'redux'
import { combineEpics } from 'redux-observable'

import auth, { authReplayEpic, authRefreshEpic, authLoginEpic, authLogoutEpic } from './api'
import profile, { profileLoadEpic } from './profile'
import team, { teamLoadEpic, teamListAthletesEpic } from './teams'
import athlete, { athleteLoadEpic } from './athletes'

const stores = combineReducers({
  auth,
  profile,
  team,
  athlete
})

const epics = combineEpics(
  authReplayEpic,
  authRefreshEpic,
  authLoginEpic,
  authLogoutEpic,
  profileLoadEpic,
  teamLoadEpic,
  teamListAthletesEpic,
  athleteLoadEpic
)

export { stores, epics }
