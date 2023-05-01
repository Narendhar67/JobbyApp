import {Component} from 'react'
import Cookies from 'js-cookie'
import {MdLocationOn, MdWork} from 'react-icons/md'
import {AiFillStar} from 'react-icons/ai'
import {BiLinkExternal} from 'react-icons/bi'
import Loader from 'react-loader-spinner'

import Header from '../Header'
import SimilarJob from '../similarJob'
import './index.css'

const apiStatus = {
  initial: 'INITIAL',
  loading: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class JobItemDetails extends Component {
  state = {status: apiStatus.initial, jobDetails: {}, similarJobs: []}

  componentDidMount() {
    this.getData()
  }

  getData = async () => {
    this.setState({status: apiStatus.loading})
    const {match} = this.props
    const {params} = match
    const {id} = params
    const Url = `https://apis.ccbp.in/jobs/${id}`
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(Url, options)
    const data = await response.json()

    if (response.ok === true) {
      const similarJobs = data.similar_jobs.map(each => ({
        companyLogoUrl: each.company_logo_url,
        employmentType: each.employment_type,
        id: each.id,
        jobDescription: each.job_description,
        location: each.location,
        rating: each.rating,
        title: each.title,
      }))
      const convertJobDetails = each => ({
        companyLogoUrl: each.company_logo_url,
        companyWebsiteUrl: each.company_website_url,
        employmentType: each.employment_type,
        id: each.id,
        jobDescription: each.job_description,
        location: each.location,
        packagePerAnnum: each.package_per_annum,
        rating: each.rating,
        title: each.title,
        skills: each.skills,
        lifeAtCompany: each.life_at_company,
      })
      const jobDetails = convertJobDetails(data.job_details)

      this.setState({status: apiStatus.success, similarJobs, jobDetails})
    } else {
      this.setState({status: apiStatus.failure})
    }
  }

  renderSkills = () => {
    const {jobDetails} = this.state
    const {skills} = jobDetails
    return (
      <>
        <h1>Skills</h1>
        <ul className="skills-List">
          {skills.map(each => (
            <div key={each.name} className="skill-card">
              <img src={each.image_url} alt={each.name} />
              <p className="skill-name">{each.name}</p>
            </div>
          ))}
        </ul>
      </>
    )
  }

  renderLifeAtCompany = () => {
    const {jobDetails} = this.state
    const {lifeAtCompany} = jobDetails
    console.log(lifeAtCompany)

    return (
      <div className="lifeAtCompany-container">
        <h1 className="heading-lifeAtCompany">Life at Company</h1>
        <div className="lifeAtCompany">
          <p>{lifeAtCompany.description}</p>
          <img src={lifeAtCompany.image_url} alt="life at company" />
        </div>
      </div>
    )
  }

  renderSimilarJobs = () => {
    const {similarJobs} = this.state

    return (
      <div>
        <h1 className="heading-similar-jobs">Similar Jobs</h1>
        <ul className="similarJobsList">
          {similarJobs.map(each => (
            <SimilarJob key={each.id} jobDetails={each} />
          ))}
        </ul>
      </div>
    )
  }

  renderFailureView = () => (
    <div className="noJobsView">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
        className="noJobs-img"
      />
      <h1>Oops! Something Went Wrong</h1>
      <p>We cannot seem to find the page you are looking for.</p>
      <button type="button" onClick={this.getData}>
        Retry
      </button>
    </div>
  )

  renderLoader = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderJobSuccessView = () => {
    const {jobDetails} = this.state
    const {
      companyLogoUrl,
      companyWebsiteUrl,
      employmentType,
      jobDescription,
      location,
      packagePerAnnum,
      rating,
      title,
    } = jobDetails
    return (
      <>
        <div className="job-card">
          <div className="logo-name">
            <img
              className="company-logo"
              src={companyLogoUrl}
              alt="job details company logo"
            />
            <div>
              <h1 className="title">{title}</h1>
              <p>
                <AiFillStar className="star" />
                {rating}
              </p>
            </div>
          </div>
          <div className="info-bar">
            <div className="logoWithName">
              <div className="logoWithName">
                <MdLocationOn />
                <p className="name-logo">{location}</p>
              </div>
              <div className="logoWithName">
                <MdWork />
                <p className="name-logo">{employmentType}</p>
              </div>
            </div>
            <div className="logoWithName">
              <p className="income">{packagePerAnnum}</p>
            </div>
          </div>
          <hr />
          <div className="description-bar">
            <h1>Description</h1>
            <a className="Link" href={companyWebsiteUrl}>
              Visit
              <BiLinkExternal />
            </a>
          </div>

          <p>{jobDescription}</p>
          {this.renderSkills()}
          {this.renderLifeAtCompany()}
        </div>
        {this.renderSimilarJobs()}
      </>
    )
  }

  renderFinalView = () => {
    const {status} = this.state

    switch (status) {
      case apiStatus.loading:
        return this.renderLoader()
      case apiStatus.success:
        return this.renderJobSuccessView()
      case apiStatus.failure:
        return this.renderFailureView()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        <div className="jobItem-bg">{this.renderFinalView()}</div>
      </>
    )
  }
}

export default JobItemDetails
