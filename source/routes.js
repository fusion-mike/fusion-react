
import React from 'react'
import BasicLayout from './layouts/BasicLayout'

import { App } from './containers/App'
import { Login } from './containers/Login'
import { Missing } from './containers/Missing'
import { Team } from './containers/Team'
import { Athlete } from './containers/Athlete'

export default [
  {
    path: '/',
    action: (context) => (
      <BasicLayout>
        <App />
      </BasicLayout>
    )
  },
  {
    path: '/team/:teamId/athlete/:athleteId',
    action: (context) => (
      <BasicLayout>
        <Athlete />
      </BasicLayout>
    )
  },
  {
    path: '/team/:teamId',
    action: (context) => (
      <BasicLayout>
        <Team />
      </BasicLayout>
    )
  },
  {
    path: '/signin',
    action: (context) => (
      <Login />
    ),
    default: true,
    anonymous: true
  },
  {
    path: '/missing',
    action: (context) => (
      <Missing />
    ),
    missing: true,
    anonymous: true
  }
]
