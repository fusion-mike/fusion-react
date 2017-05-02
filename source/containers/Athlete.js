
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { history } from '../utilities'
import { athleteLoad } from '../modules/athletes'

class AthleteComponent extends Component {
  constructor(props) {
    super(props)
  }

  navigate(evt) {
    evt.preventDefault()
    history.push({
      pathname: evt.currentTarget.pathname,
      search: evt.currentTarget.search
    })
  }

  componentWillMount() {
    const { loadAthlete } = this.props
    loadAthlete()
  }

  componentWillReceiveProps(next) {
    const { athleteId, selectAthlete } = this.props
    if (athleteId !== next.athleteId)
      selectAthlete(next.athleteId)
  }

  render() {
    const { athlete, teamId } = this.props
    
    if (!athlete || athlete === null)
      return null

    return (
      <div>
        <div>{athlete.FirstName + ' ' + athlete.LastName}</div>
        <div><a href={`/team/${teamId}`} onClick={this.navigate}>Return To Team</a></div>
        <div><a href="/" onClick={this.navigate}>Return To Profile</a></div>
      </div>
    )
  }
}

const mapState = (state, ownProps) => {
  const { teamId, athleteId } = ownProps
  const { athlete: { entries = {} }} = state
  const athlete = entries[+athleteId]

  return {
    teamId,
    athleteId,
    athlete
  }
}

const mapDispatch = (dispatch, ownProps) => {
  const { teamId, athleteId } = ownProps
  return {
    loadAthlete: (id) => {
      dispatch(athleteLoad(teamId, athleteId))
    },
    selectAthlete: (id) => {
      dispatch(athleteLoad(teamId, id))
    }
  }
}

const Athlete = connect(mapState, mapDispatch)(AthleteComponent)
export { Athlete }
