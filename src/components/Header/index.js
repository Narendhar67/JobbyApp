import {Link, withRouter} from 'react-router-dom'
import Cookies from 'js-cookie'

import './index.css'

const Header = props => {
  const onLogout = () => {
    const {history} = props
    Cookies.remove('jwt_token')

    history.replace('/login')
  }

  return (
    <nav className="header-bg">
      <Link to="/">
        <img
          src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
          alt="website logo"
          className="header-logo"
        />
      </Link>
      <ul className="links">
        <li className="link-item">
          <Link className="Link" to="/">
            <p>Home</p>
          </Link>
        </li>
        <li className="link-item">
          <Link className="Link" to="/jobs">
            <p>Jobs</p>
          </Link>
        </li>
      </ul>
      <li>
        <button onClick={onLogout} type="button" className="logout-button">
          Logout
        </button>
      </li>
    </nav>
  )
}

export default withRouter(Header)
