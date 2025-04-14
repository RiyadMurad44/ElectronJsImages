import './styles.css'
import React, { useState } from 'react'
import RedButton from '../RedButton'
import { Link, useNavigate } from 'react-router-dom'
import GreenButton from '../GreenButton'
import ProfilePic from '../../assets/photos/Me.jpeg'

const Navbar = () => {
  const navigate = useNavigate()
  const handleLogout = () => {}

  return (
    <div className="navbar">
      <div className="navbar-left">
        <Link to="/profile">
          <img src={ProfilePic} alt="Profile" className="navbar-logo" />
        </Link>
        <Link to="/home" className="navbar-title">
          My Images
        </Link>
      </div>

      <div className="navbar-center">
        <Link to="/home" className="navbar-home">
          Home
        </Link>
        <Link to="/profile" className="navbar-profile">
          Profile
        </Link>
      </div>

      <div className="navbar-right">
        <GreenButton label="Add Image" action={() => navigate('/imageUpload')} />
        <RedButton label="Logout" action={handleLogout} />
      </div>
    </div>
  )
}

export default Navbar
