import React from 'react'
import Lottie from 'lottie-react'

const Loader = ({ animationData, loop = true, styles = {} }) => {
  return (
    <div style={styles}>
      <Lottie animationData={animationData} loop={loop} />
    </div>
  )
}

export default Loader
