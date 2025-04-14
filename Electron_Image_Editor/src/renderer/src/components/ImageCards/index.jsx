import React from 'react'
import GreenButton from '../GreenButton'
import RedButton from '../RedButton'
import './styles.css'

const ImageCard = ({ imageSrc, title, description, onEdit, onDelete }) => {
  return (
    <div className="image-card">
      <img src={imageSrc} alt={title} className="card-image" />
      <div className="card-content">
        <h4>{title}</h4>
        <p>{description}</p>
        <div className="card-buttons">
          <GreenButton
            label="Edit Image"
            action={onEdit}
          />
          <RedButton label="Delete Image" action={onDelete} />
        </div>
      </div>
    </div>
  )
}

export default ImageCard
