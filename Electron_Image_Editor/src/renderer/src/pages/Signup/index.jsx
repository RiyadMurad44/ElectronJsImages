import './styles.css'
import React, { useState } from 'react'
import axiosBaseUrl from '../../Axios/axios'
import { Link, useNavigate } from 'react-router-dom'

export const Signup = () => {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSignup = async (e) => {
    e.preventDefault()

    try {
      const response = await axiosBaseUrl.post('/signup', {
        name,
        email,
        password
      })

      if (response.data.success === true) {
        localStorage.setItem('Token', response.data.data.token)
        navigate('/home')
      } else {
        console.log('Signup Failed:', response.data.message)
      }
    } catch (error) {
      console.error('Error During Signup:', error)
    }
  }

  return (
    <div className="signup-container">
      <div className="signup-scroll-view">
        <div className="signup-form">
          <div className="signup-header">
            <span className="signup-title">{'Sign Up'}</span>
          </div>
          <span className="input-label">{'Full Name*'}</span>
          <input
            placeholder={'Full Name'}
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="name-input"
          />
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
          <button className="signup-button" onClick={handleSignup}>
            <span className="button-text">{'Sign Up'}</span>
          </button>
          <p className="login-prompt">
            Already Have an Account? <Link to={'/'}>Login</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
