import './styles.css'
import React from 'react'
import RedButton from '../redButton'
import { Link } from 'react-router-dom'
import GreenButton from '../greenButton'
import ProfilePic from '../../assets/photos/Me.jpeg'

const Navbar = () => {
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
        <GreenButton label="Add Image" action="/addImage" />
        <RedButton label="Logout" action={logout} />
      </div>
    </div>
  )
}

export default Navbar
