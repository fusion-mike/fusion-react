
const mapProfileApi = (data) => {
  const profile = Object.assign({}, {
    UserId: data.UserId,
    OrganizationID: data.OrganiztaionId,
    OrganizationName: data.OrganizatioName,
    OrganizationType: data.OrganizationType,
    PractitionerId: data.PractitionerId,
    FirstName: data.FirstName,
    LastName: data.LastName,
    Email: data.Email,
    Identifier: data.Identifier
  })

  return Object.assign({}, {
    profile: profile,
    teams: data.Teams,
    facilities: data.Facilities
  })
}

export { mapProfileApi }
