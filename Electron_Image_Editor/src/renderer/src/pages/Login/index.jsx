import './styles.css'
import { z } from 'zod'
import React, { useState } from 'react'
import axiosBaseUrl from '../../Axios/axios'
import Loader from '../../components/Loader'
import getGeoAndIp from '../../Utils/getGeoAndIp'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { ToastContainer, toast } from 'react-toastify'
import { toggleLoad } from '../../State/Redux/Slices/loadingSlice'
import LoadingAnimation from '../../assets/Animations/LoadingAnimation.json'

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Invalid Password')
})

export const Login = () => {
  const isLoading = useSelector((state) => state.loading.loadingState)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = async (e) => {
    e.preventDefault()

    // Validate inputs using Zod
    const validation = loginSchema.safeParse({ email, password })
    if (!validation.success) {
      const firstError = validation.error.errors[0]?.message || 'Invalid input'
      toast.error(firstError)
      return
    }

    dispatch(toggleLoad(true))

    try {
      const { ip, geolocation } = await getGeoAndIp()

      const response = await axiosBaseUrl.post('/login', {
        email,
        password,
        ip,
        geolocation
      })

      if (response.data.success === true) {
        localStorage.setItem('Token', response.data.data.token)
        navigate('/home')
      } else {
        toast.warning('Login Failed')
      }
    } catch (error) {
      toast.error('Error During Login')
    } finally {
      dispatch(toggleLoad(false))
    }
  }

  return (
    <div className="login-container">
      <ToastContainer />
      <div className="login-scroll-view">
        <div className="login-form">
          <div className="login-header">
            <span className="login-title">Log In</span>
          </div>

          <span className="input-label">Email Address*</span>
          <input
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="email-input"
          />

          <span className="input-label">Password*</span>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="password-input"
          />

          <button className="login-button" onClick={handleLogin} disabled={isLoading}>
            <span className="button-text">
              {isLoading ? (
                <Loader
                  animationData={LoadingAnimation}
                  loop={true}
                  styles={{ width: 25, height: 25 }}
                />
              ) : (
                'Login'
              )}
            </span>
          </button>

          <p className="signup-prompt">
            Don’t Have an Account? <Link to="/signup">Sign Up</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
