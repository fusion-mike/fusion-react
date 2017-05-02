
import React, { Component } from 'react'
import { connect } from 'react-redux'
import moment from 'moment'
import { history } from '../utilities'
import { profileLoad, profileRefresh } from '../modules/profile'

class AppComponent extends Component {
  constructor(props) {
    super(props)

    this.refresh = this.refresh.bind(this)
  }

  navigate(evt) {
    evt.preventDefault()
    history.push({
      pathname: evt.currentTarget.pathname,
      search: evt.currentTarget.search
    })
  }

  refresh(evt) {
    evt.preventDefault()
    const { refreshProfile } = this.props
    refreshProfile()
  }

  componentWillMount() {
    const { authorized, loadProfile } = this.props
    if (authorized)
      loadProfile()
  }

  render() {
    const { fetched } = this.props
    
    return (
      <div>
        <div className="welcome-banner">
          <div>Fusionetics React</div>
          <div>Welcome to the show { this.renderProfileName() }</div>
          <div>{moment(fetched).format('MMMM D, YYYY hh:mm:ss')}</div>
        </div>
        { this.renderOrganizationBanner() }
        { this.renderTeams() }
        { this.renderFacilities() }
        <div><button type="button" onClick={this.refresh}>Refresh Profile</button></div>
      </div>
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

  renderTeams() {
    const { teams } = this.props
    if (!(teams && teams.length))
      return null

    const elements = teams.map(team => (
      <div key={`team_${team.TeamId}`}>
        <a href={`/team/${team.TeamId}`} onClick={this.navigate}>{team.Name}</a>
      </div>
    ))

    return (
      <div>
        <div>Teams</div>
        { elements }
      </div>
    )
  }

  renderFacilities() {
    const { facilities } = this.props
    if (!(facilities && facilities.length))
      return null

    const elements = facilities.map(facility => (
      <div key={`facility_${facility.FacilityId}`}>{facility.Name}</div>
    ))

    return (
      <div>
        <div>Facilities</div>
        { elements }
      </div>
    )
  }

  renderProfileName() {
    const { profile } = this.props
    if (!profile || profile == null)
      return null

    return (
      <span>{profile.FirstName + ' ' + profile.LastName}</span>
    )
  }
}

const mapState = (state) => {
  const {
    auth: { authorized }, profile: { profile, teams, facilities, fetched }} = state

  let organization
  if (profile && profile !== null) {
    organization = Object.assign({}, {
      OrganizationID: profile.OrganizationID,
      OrganizationName: profile.OrganizationName,
      OrganizationType: profile.OrganizationType
    })
  }

  return {
    authorized,
    profile,
    organization,
    teams,
    facilities,
    fetched
  }
}

const mapDispatch = (dispatch) => {
  return {
    loadProfile: () => {
      dispatch(profileLoad())
    },
    refreshProfile: () => {
      dispatch(profileRefresh())
    }
  }
}

const App = connect(mapState, mapDispatch)(AppComponent)
export { App }
