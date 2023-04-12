import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import {BsSearch} from 'react-icons/bs'

import JobCard from '../JobCard/index'
import Header from '../Header'
import './index.css'

const profileApiStatus = {
  initial: 'INITIAL',
  loading: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

const jobsViewStatus = {
  initial: 'INITIAL',
  loading: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
  noJobs: 'NO_JOBS',
}

class Jobs extends Component {
  state = {
    profileData: {},
    profileState: profileApiStatus.initial,
    jobsStatus: jobsViewStatus.initial,
    search: '',
    SelectedTypeOfEmploymentList: [],
    salaryRange: '',
    jobsData: [],
  }

  componentDidMount() {
    this.getProfileData()
    this.getJobsData()
  }

  getProfileData = async () => {
    this.setState({profileState: profileApiStatus.loading})
    const jwtToken = Cookies.get('jwt_token')
    const profileUrl = 'https://apis.ccbp.in/profile'
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(profileUrl, options)
    const profileData = await response.json()
    if (response.ok === true) {
      const data = x => ({
        name: x.name,
        profileImageUrl: x.profile_image_url,
        shortBio: x.short_bio,
      })
      const updatedData = data(profileData.profile_details)
      this.setState({
        profileData: updatedData,
        profileState: profileApiStatus.success,
      })
    } else {
      this.setState({profileState: profileApiStatus.failure})
    }
  }

  renderLoader = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderProfileSuccess = () => {
    const {profileData} = this.state
    const {name, profileImageUrl, shortBio} = profileData

    return (
      <div className="profile-container">
        <img className="profile-logo" src={profileImageUrl} alt="profile" />
        <h1 className="name">{name}</h1>
        <p className="bio">{shortBio}</p>
      </div>
    )
  }

  renderProfileFailure = () => (
    <div className="profileFailure-container">
      <button
        type="button"
        onClick={this.getProfileData}
        className="login-button"
      >
        retry
      </button>
    </div>
  )

  renderProfile = () => {
    const {profileState} = this.state

    switch (profileState) {
      case profileApiStatus.loading:
        return this.renderLoader()
      case profileApiStatus.success:
        return this.renderProfileSuccess()
      case profileApiStatus.failure:
        return this.renderProfileFailure()
      default:
        return null
    }
  }

  searchBar = () => {
    const {search} = this.state
    const updateSearch = event => {
      this.setState({search: event.target.value})
    }
    const onClickSearch = () => {
      this.getJobsData()
    }

    return (
      <div className="search-bar">
        <input
          value={search}
          type="search"
          onChange={updateSearch}
          className="input"
          placeholder="Search"
        />
        <button
          type="button"
          className="searchButton"
          data-testid="searchButton"
          onClick={onClickSearch}
        >
          <BsSearch className="search-icon" />
        </button>
      </div>
    )
  }

  renderTypeOfEmployee = () => {
    const {employmentTypesList} = this.props
    const {SelectedTypeOfEmploymentList} = this.state
    let updatedList = [...SelectedTypeOfEmploymentList]

    const onclick = event => {
      if (event.target.checked) {
        updatedList = [...updatedList, event.target.value]
      } else {
        updatedList.splice(updatedList.indexOf(event.target.value), 1)
      }
      this.setState(
        {SelectedTypeOfEmploymentList: updatedList},
        this.getJobsData,
      )
    }

    return (
      <div className="type-of-employment">
        <h3 className="sub-heading">Type of Employment</h3>
        <ul className="employeeList">
          {employmentTypesList.map(each => (
            <li className="employeeType" key={each.employmentTypeId}>
              <input
                type="checkbox"
                id={each.employmentTypeId}
                onChange={onclick}
                value={each.employmentTypeId}
              />
              <label className="employee-label" htmlFor={each.employmentTypeId}>
                {each.label}
              </label>
            </li>
          ))}
        </ul>
      </div>
    )
  }

  renderSalaryType = () => {
    const {salaryRangesList} = this.props

    const onclick = event => {
      this.setState({salaryRange: event.target.value}, this.getJobsData)
    }
    return (
      <div className="type-of-employment">
        <h3 className="sub-heading">Salary Range</h3>
        <ul className="employeeList">
          {salaryRangesList.map(each => (
            <li className="employeeType" key={each.salaryRangeId}>
              <input
                type="radio"
                id={each.salaryRangeId}
                onChange={onclick}
                value={each.salaryRangeId}
                name="salaryType"
              />
              <label className="employee-label" htmlFor={each.salaryRangeId}>
                {each.label}
              </label>
            </li>
          ))}
        </ul>
      </div>
    )
  }

  getJobsData = async () => {
    this.setState({jobsStatus: jobsViewStatus.loading})
    const {salaryRange, SelectedTypeOfEmploymentList, search} = this.state
    const employees = SelectedTypeOfEmploymentList.join(',')
    const Url = `https://apis.ccbp.in/jobs?employment_type=${employees}&minimum_package=${salaryRange}&search=${search}`
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(Url, options)
    const Data = await response.json()

    if (response.ok === true) {
      const convertedData = Data.jobs.map(each => ({
        companyLogoUrl: each.company_logo_url,
        employmentType: each.employment_type,
        id: each.id,
        jobDescription: each.job_description,
        location: each.location,
        packagePerAnnum: each.package_per_annum,
        rating: each.rating,
        title: each.title,
      }))
      if (convertedData.length === 0) {
        this.setState({jobsStatus: jobsViewStatus.noJobs})
      } else {
        this.setState({
          jobsData: convertedData,
          jobsStatus: jobsViewStatus.success,
        })
      }
    } else {
      this.setState({jobsStatus: jobsViewStatus.failure})
    }
  }

  renderJobsSuccessView = () => {
    const {jobsData} = this.state

    return (
      <>
        <ul className="jobs-list">
          {jobsData.map(each => (
            <JobCard details={each} key={each.id} />
          ))}
        </ul>
      </>
    )
  }

  renderNoJobView = () => (
    <div className="noJobsView">
      <img
        src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
        alt="no jobs"
        className="noJobs-img"
      />
      <h1>No Jobs Found</h1>
      <p>We could not find any jobs. Try other filters</p>
    </div>
  )

  renderJobFailureView = () => (
    <div className="noJobsView">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
        className="noJobs-img"
      />
      <h1>Oops! Something Went Wrong</h1>
      <p>We cannot seem to find the page you are looking for.</p>
      <button type="button" onClick={this.getJobsData}>
        Retry
      </button>
    </div>
  )

  renderJobsView = () => {
    const {jobsStatus} = this.state

    switch (jobsStatus) {
      case jobsViewStatus.loading:
        return this.renderLoader()
      case jobsViewStatus.success:
        return this.renderJobsSuccessView()
      case jobsViewStatus.noJobs:
        return this.renderNoJobView()
      case jobsViewStatus.failure:
        return this.renderJobFailureView()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        <div className="jobs-bg-container">
          <div className="profile-And-Options-container">
            {this.renderProfile()}
            <hr />

            {this.renderTypeOfEmployee()}
            <hr />
            {this.renderSalaryType()}
          </div>
          <div className="second-half">
            <div>{this.searchBar()}</div>
            {this.renderJobsView()}
          </div>
        </div>
      </>
    )
  }
}

export default Jobs
