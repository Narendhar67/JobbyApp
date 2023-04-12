import {Component} from 'react'
import Cookies from 'js-cookie'
import {Redirect} from 'react-router-dom'

import './index.css'

class Login extends Component {
  state = {username: '', password: '', error: false, errorMsg: ''}

  updateUsername = event => {
    this.setState({username: event.target.value})
  }

  updatePassword = event => {
    this.setState({password: event.target.value})
  }

  submitForm = async event => {
    event.preventDefault()
    const {history} = this.props
    const {username, password} = this.state
    const loginDetails = {username, password}
    const Url = 'https://apis.ccbp.in/login'
    const options = {
      method: 'POST',
      body: JSON.stringify(loginDetails),
    }

    const response = await fetch(Url, options)
    const data = await response.json()
    if (response.ok === true) {
      Cookies.set('jwt_token', data.jwt_token, {expires: 7})
      this.setState({username: '', password: ''})
      history.replace('/')
    } else {
      this.setState({error: true, errorMsg: data.error_msg})
    }
  }

  render() {
    const token = Cookies.get('jwt_token')
    if (token !== undefined) {
      return <Redirect to="/" />
    }
    const {username, password, error, errorMsg} = this.state

    return (
      <div className="bg-container">
        <div className="login-form-container">
          <img
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            alt="website logo"
            className="Logo"
          />
          <form className="form" onSubmit={this.submitForm}>
            <div className="input-box">
              <label className="label-element" htmlFor="username">
                USERNAME
              </label>
              <input
                className="input-element"
                placeholder="Username"
                id="username"
                onChange={this.updateUsername}
                value={username}
              />
            </div>
            <div className="input-box">
              <label className="label-element" htmlFor="password">
                PASSWORD
              </label>
              <input
                className="input-element"
                placeholder="Password"
                type="password"
                id="password"
                onChange={this.updatePassword}
                value={password}
              />
              {error && <p className="errorMsg">{`*${errorMsg}`}</p>}
            </div>
            <button type="submit" className="login-button">
              Login
            </button>
          </form>
        </div>
      </div>
    )
  }
}

export default Login
