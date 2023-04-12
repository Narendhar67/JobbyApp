import {Link} from 'react-router-dom'
import {AiFillStar} from 'react-icons/ai'
import {MdLocationOn, MdWork} from 'react-icons/md'

import './index.css'

const SimilarJob = props => {
  const {jobDetails} = props
  const {
    companyLogoUrl,
    employmentType,
    id,
    jobDescription,
    location,
    rating,
    title,
  } = jobDetails

  return (
    <li className="single-item">
      <Link className="Link" to={`/jobs/'${id}`}>
        <div className="similar-job-card">
          <div className="logo-name">
            <img
              className="company-logo"
              src={companyLogoUrl}
              alt="similar job company logo"
            />
            <div>
              <h1 className="title">{title}</h1>
              <p>
                <AiFillStar className="star" />
                {rating}
              </p>
            </div>
          </div>
          <h1>Description</h1>
          <p>{jobDescription}</p>
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
          </div>
        </div>
      </Link>
    </li>
  )
}

export default SimilarJob
