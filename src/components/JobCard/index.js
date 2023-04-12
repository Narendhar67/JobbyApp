import {Link} from 'react-router-dom'

import {MdLocationOn, MdWork} from 'react-icons/md'
import {AiFillStar} from 'react-icons/ai'
import './index.css'

const JobCard = props => {
  const {details} = props
  const {
    companyLogoUrl,
    employmentType,
    id,
    jobDescription,
    location,
    packagePerAnnum,
    rating,
    title,
  } = details
  return (
    <li>
      <Link className="Link" to={`/jobs/${id}`}>
        <div className="job-card">
          <div className="logo-name">
            <img
              className="company-logo"
              src={companyLogoUrl}
              alt="company logo"
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
          <hr className="hr" />
          <h1>Description</h1>
          <p>{jobDescription}</p>
        </div>
      </Link>
    </li>
  )
}
export default JobCard
