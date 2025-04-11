import React from 'react'
import './styles.css'

const RedButton = ({ label, action }) => {
  return <button className="red-button" onClick={action}>{label}</button>
}

export default RedButton
