import React from 'react'
import './styles.css'

const GreenButton = ({ label, action }) => {
  return <button className="green-button" onClick={action}>{label}</button>
}

export default GreenButton
