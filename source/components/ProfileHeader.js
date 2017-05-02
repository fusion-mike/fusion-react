
import React, { Component } from 'react'
import { connect } from 'react-redux'
import moment from 'moment'
import { history } from '../utilities'
import { apiSignout } from '../modules/api'

class HeaderComponent extends Component {
  constructor(props) {
    super(props)

    this.logout = this.logout.bind(this)
  }

  logout(evt) {
    evt.preventDefault()

    const { signout } = this.props
    signout()
  }

  navigate(evt) {
    evt.preventDefault()
    history.push({
      pathname: evt.currentTarget.pathname,
      search: evt.currentTarget.search
    })
  }

  render() {
    const { profile, fetched, recentAthletes, teamId } = this.props
    if (!profile || profile == null)
      return null

    const { FirstName, LastName } = profile
    const lastFetched = moment(fetched)

    let recent = (<div className="profile-recent" />)
    if (recentAthletes && recentAthletes !== null && recentAthletes.length) {
      recent = (
        <div className="profile-recent">
          { recentAthletes.map((athlete) => {
            if (athlete.selected)
              return (
                <div key={`recent_${athlete.AthleteId}`} className="recent-entry">
                  {athlete.FirstName + ' ' + athlete.LastName}
                </div>
              )
            
            return (
              <div key={`recent_${athlete.AthleteId}`} className="recent-entry">
                <a href={`/team/${teamId}/athlete/${athlete.AthleteId}`} onClick={this.navigate}>
                  {athlete.FirstName + ' ' + athlete.LastName}
                </a>
              </div>
            )
          })}
        </div>
      )
    }

    return (
      <div className="profile-header">
        <div className="profile-info">
          <div className="name">{FirstName + ' ' + LastName}</div>
          <div className="right-container">
            <div className="sign-out"><button onClick={this.logout}>Sign Out</button></div>
            <div className="small-info">{lastFetched.format('MMMM D, YYYY hh:mm:ss')}</div>
          </div>
        </div>
        {recent}
      </div>
    )
  }
}

const mapState = (state, ownProps) => {
  const { profile: { profile }, profile: { fetched }} = state
  const { athlete: { 
    currentTeamId: teamId,
    currentAthleteId: athleteId,
    entries: athletes = {},
    recents = []
  }} = state

  const recentAthletes = recents
    .filter((id) => (
      athletes[id]
    ))
    .map((id) => {
      const athlete = athletes[id]
      return Object.assign({}, {
        AthleteId: athlete.AthleteId,
        FirstName: athlete.FirstName,
        LastName: athlete.LastName,
        selected: (athlete.AthleteId === athleteId)
      })
    })

  return {
    profile,
    fetched,
    recentAthletes,
    teamId
  }
}

const mapDispatch = (dispatch, ownProps) => {
  return {
    signout: () => {
      dispatch(apiSignout())
    }
  }
}

export default connect(mapState, mapDispatch)(HeaderComponent)
