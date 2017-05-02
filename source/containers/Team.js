
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { history } from '../utilities'
import { teamLoad, teamListAthletes } from '../modules/teams'
import InputDropDown from '../components/InputDropDown'
import InputTextSearch from '../components/InputTextSearch'

class TeamComponent extends Component {
  constructor(props) {
    super(props)
    this.state = {
      term: undefined
    }

    this.handleSearch = this.handleSearch.bind(this)
    this.handleSelect = this.handleSelect.bind(this)
  }

  navigate(evt) {
    evt.preventDefault()
    history.push({
      pathname: evt.currentTarget.pathname,
      search: evt.currentTarget.search
    })
  }

  handleSearch(term) {
    this.setState({
      term: term
    })
  }

  handleSelect(option) {
    const { teamId } = this.props
    history.push('/team/' + teamId + '/athlete/' + option.id)
  }

  componentWillMount() {
    const { loadTeam } = this.props
    loadTeam()
  }

  render() {
    const { teamId, athletes } = this.props
    const filtered = this.filterAthletes(athletes)

    const options = athletes.map(athlete => (
      Object.assign({}, {
        id: athlete.AthleteId,
        name: (athlete.FirstName + ' ' + athlete.LastName)
      })
    ))

    return (
      <div>
        { this.renderOrganizationBanner() }
        { this.renderTeamBanner() }
        { this.renderAthleteBanner() }
        <InputDropDown options={options} selected={this.handleSelect} />
        <InputTextSearch search={this.handleSearch} />
        { this.renderAthleteList(teamId, filtered) }
        <div><a href="/" onClick={this.navigate}>Return To Profile</a></div>
      </div>
    )
  }

  renderTeamBanner() {
    const { team } = this.props
    if (!team || team === null)
      return null

    return (
      <div>{team.Name}</div>
    )
  }

  renderAthleteBanner() {
    const { athletes } = this.props
    if (!(athletes && athletes.length))
      return null
    
    return (
      <div>Athletes ({athletes.length})</div>
    )
  }

  renderOrganizationBanner() {
    const { organization } = this.props
    if (!organization || organization == null)
      return null

    return (
      <div>{organization.OrganizationName}</div>
    )
  }

  renderAthleteList(teamId, athletes) {
    return athletes.map(athlete => (
      <div key={`team_${athlete.AthleteId}`}>
        <a href={`/team/${teamId}/athlete/${athlete.AthleteId}`} onClick={this.navigate}>
          {athlete.FirstName + ' ' + athlete.LastName}
        </a>
      </div>
    ))
  }

  filterAthletes(athletes) {
    const { term } = this.state

    return athletes.filter(athlete => {
      if (!term || term === null || !term.length)
        return true

      const fnFound = (athlete.FirstName.toUpperCase().indexOf(term.toUpperCase()) !== -1)
      const lnFound = (athlete.LastName.toUpperCase().indexOf(term.toUpperCase()) !== -1)
      return (fnFound || lnFound)
    })
  }
}

const mapState = (state, ownProps) => {
  const { teamId } = ownProps
  const { team: { entries = {}, athletes = [] }} = state
  const team = entries[+teamId]

  let organization
  if (team && team !== null) {
    organization = Object.assign({}, {
      OrganizationID: team.OrganizationID,
      OrganizationName: team.OrganizationName,
      OrganizationType: team.OrganizationType
    })
  }

  return {
    teamId,
    team,
    athletes,
    organization
  }
}

const mapDispatch = (dispatch, ownProps) => {
  const { teamId } = ownProps
  return {
    loadTeam: () => {
      dispatch(teamLoad(teamId))
      dispatch(teamListAthletes(teamId))
    }
  }
}

const Team = connect(mapState, mapDispatch)(TeamComponent)
export { Team }
