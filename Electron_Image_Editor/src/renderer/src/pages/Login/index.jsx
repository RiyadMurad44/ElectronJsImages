import './styles.css'
import React, { useState } from 'react'
import axiosBaseUrl from '../../Axios/axios'
import { Link, useNavigate } from 'react-router-dom'

export const Login = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = async (e) => {
    e.preventDefault()

    try {
      const response = await axiosBaseUrl.post('/login', {
        email,
        password
      })

      if (response.data.success == true) {
        localStorage.setItem('Token', response.data.data.token)
        navigate('home')
      } else {
        console.log('Login Failed:', response.data.message)
      }
    } catch (error) {
      console.error('Error During Login:', error)
    }
  }

  return (
    <div className="login-container">
      <div className="login-scroll-view">
        <div className="login-form">
          <div className="login-header">
            <span className="login-title">{'Log In'}</span>
          </div>
          <span className="input-label">{'Email Address*'}</span>
          <input
            placeholder={'Email Address'}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="email-input"
          />
          <span className="input-label">{'Password*'}</span>
          <input
            type="password"
            placeholder={'Password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="password-input"
          />
          <button className="login-button" onClick={handleLogin}>
            <span className="button-text">{'Log In'}</span>
          </button>
          <p className="signup-prompt">
            Don’t Have an Account? <Link to={'/signup'}>Sign Up</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
