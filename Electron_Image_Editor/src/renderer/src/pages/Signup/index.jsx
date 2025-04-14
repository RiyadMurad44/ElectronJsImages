import './styles.css'
import { z } from 'zod'
import React, { useState } from 'react'
import axiosBaseUrl from '../../Axios/axios'
import Loader from '../../components/Loader'
import getGeoAndIp from '../../Utils/getGeoAndIp'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { ToastContainer, toast } from 'react-toastify';
import { toggleLoad } from '../../State/Redux/Slices/loadingSlice'
import LoadingAnimation from "../../assets/Animations/LoadingAnimation.json"

const signupSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

const Signup = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const isLoading = useSelector((state) => state.loading.loadingState)

  const handleSignup = async (e) => {
    e.preventDefault()

    const validation = signupSchema.safeParse({ name, email, password })

    if (!validation.success) {
      const firstError = validation.error.errors[0]?.message || 'Invalid input'
      toast.error(firstError)
      return
    }

    dispatch(toggleLoad(true))

    try {
      const { ip, geolocation } = await getGeoAndIp()

      const response = await axiosBaseUrl.post('/signup', {
        name,
        email,
        password,
        ip,
        geolocation
      })

      if (response.data.success === true) {
        localStorage.setItem('Token', response.data.data.token)
        navigate('/home')
      } else {
        toast.error(response.data.message || "Signup failed")
      }
    } catch (error) {
      toast.error("Error During Signup")
    } finally {
      dispatch(toggleLoad(false))
    }
  }

  return (
    <div className="signup-container">
      <ToastContainer />
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

          <button 
            className="signup-button" 
            onClick={handleSignup} 
            disabled={isLoading}
          >
            <span className="button-text">
              {isLoading 
                ? <Loader animationData={LoadingAnimation} styles={{ width: 25, height: 25 }} /> 
                : "Sign Up"
              }
            </span>
          </button>

          <p className="login-prompt">
            Already Have an Account? <Link to={'/'}>Login</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Signup
